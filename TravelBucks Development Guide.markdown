# TravelBucks Development Guide

**Date**: April 18, 2025  
**Purpose**: Guide a team of 3 junior developers to build and deploy TravelBucks, a multi-currency budgeting app for travelers, in 2 weeks.  
**Audience**: Developers with 0-1 year experience, project lead, stakeholders.

---

## 1. Overview

**TravelBucks** helps travelers like Alex, a student in Tokyo, track spending in foreign currencies (e.g., JPY) against a home currency budget (e.g., USD). The app converts transactions in real-time using daily-cached rates and displays a dual-currency dashboard.

### MVP Scope
- **Login/Creation**: Email and password setup.
- **Currency Setup**: Select home currency and foreign currency (search + flags).
- **Budget Setup**: Define categories (e.g., food, travel) and amounts.
- **Dashboard**: Donut chart of budget, transaction list in JPY and USD.
- **Transactions**: Add/edit/delete transactions with auto-conversion.
- **Deferred**: Dark mode, predictive insights, premium features (Stripe).

### Tech Stack
- **Backend**: Django (Python), Django REST Framework (DRF)
- **Frontend**: React Native
- **Database**: PostgreSQL
- **Currency API**: exchangerateapi.com (free)
- **Cache**: Redis
- **Deployment**: Heroku
- **Version Control**: GitHub
- **Monitoring**: Sentry, JSON logging

### Scale & Constraints
- **Users**: 10–50 daily active users, ~30 transactions/day.
- **Team**: 3 junior developers (0-1 year experience).
- **Timeline**: 2 weeks (2 x 1-week sprints).
- **Compliance**: GDPR (user data), PCI-DSS (future Stripe).

---

## 2. Architecture

### 2.1 Backend (Django)
**Structure**: Layered for simplicity—DRF ViewSet → Service Layer → Repository → PostgreSQL, with Redis for caching.
```
User → DRF ViewSet → Service Layer → Repository → PostgreSQL
                   ↓
             Cache Layer (Redis)
```

**Key Components**:
- **Models**: Users, budgets, transactions.
  ```python
  # travelbucks/models.py
  from django.db import models

  class User(models.Model):
      email = models.EmailField(unique=True)
      password = models.CharField(max_length=255)
      home_currency = models.CharField(max_length=3)

  class Budget(models.Model):
      user = models.ForeignKey(User, on_delete=models.CASCADE)
      category = models.CharField(max_length=50)
      amount = models.DecimalField(max_digits=10, decimal_places=2)
      currency = models.CharField(max_length=3)

  class Transaction(models.Model):
      user = models.ForeignKey(User, on_delete=models.CASCADE)
      amount = models.DecimalField(max_digits=10, decimal_places=2)
      converted_amount = models.DecimalField(max_digits=10, decimal_places=2)
      from_currency = models.CharField(max_length=3)
      to_currency = models.CharField(max_length=3)
      category = models.CharField(max_length=50)
      created_at = models.DateTimeField(auto_now_add=True)
  ```
- **Service Layer**: Handles business logic (e.g., currency conversion).
  ```python
  # travelbucks/services/conversion.py
  import requests
  from django.core.cache import cache

  class DailyConverter:
      CACHE_KEY = "fx_rates"
      TTL = 24 * 60 * 60  # 24 hours

      @classmethod
      def get_rate(cls, from_ccy: str, to_ccy: str) -> float:
          rates = cache.get(cls.CACHE_KEY)
          if not rates:
              resp = requests.get("https://api.exchangerateapi.com/v4/latest/USD")
              rates = resp.json()["rates"]
              cache.set(cls.CACHE_KEY, rates, cls.TTL)
          return rates[to_ccy] / rates[from_ccy]

      @classmethod
      def convert(cls, amount: float, from_ccy: str, to_ccy: str) -> float:
          rate = cls.get_rate(from_ccy, to_ccy)
          return round(amount * rate, 2)
  ```
  ```python
  # travelbucks/services/budget.py
  from .conversion import DailyConverter
  from .repositories.transaction import TransactionRepo

  class BudgetService:
      def __init__(self, user):
          self.user = user
          self.transaction_repo = TransactionRepo()

      def create_transaction(self, amount: float, from_currency: str, to_currency: str, category: str):
          converted_amount = DailyConverter.convert(amount, from_currency, to_currency)
          self.transaction_repo.create(
              user=self.user,
              amount=amount,
              converted_amount=converted_amount,
              from_currency=from_currency,
              to_currency=to_currency,
              category=category
          )
  ```
- **Repository**: Abstracts database access.
  ```python
  # travelbucks/repositories/transaction.py
  from django.db.models import Model

  class TransactionRepo:
      def __init__(self, model: Model = Transaction):
          self.model = model

      def create(self, **attrs):
          return self.model.objects.create(**attrs)

      def list_for_user(self, user, **filters):
          return self.model.objects.filter(user=user, **filters)
  ```
- **API Endpoints**: Simple DRF ViewSets.
  ```python
  # travelbucks/views/transaction.py
  from rest_framework.viewsets import ModelViewSet
  from .models import Transaction
  from .serializers import TransactionSerializer

  class TransactionViewSet(ModelViewSet):
      queryset = Transaction.objects.all()
      serializer_class = TransactionSerializer

      def perform_create(self, serializer):
          serializer.save(user=self.request.user)
  ```

### 2.2 Frontend (React Native)
**Structure**: Beginner-friendly layout.
```
/mobile/src
 ├── components/      # Button, DonutChart
 ├── screens/         # LoginScreen, DashboardScreen
 ├── hooks/           # useAuth, useBudget
 ├── store/           # Redux slices
 ├── services/        # API calls (axios)
```

**Key Components**:
- **State Management**: Redux Toolkit for rates, React Query for transactions.
  ```javascript
  // mobile/src/store/ratesSlice.js
  import { createSlice } from '@reduxjs/toolkit';

  const ratesSlice = createSlice({
    name: 'rates',
    initialState: { rates: {}, lastFetched: null },
    reducers: {
      setRates(state, action) {
        state.rates = action.payload;
        state.lastFetched = Date.now();
      }
    }
  });
  export const { setRates } = ratesSlice.actions;
  export default ratesSlice.reducer;
  ```
  ```javascript
  // mobile/src/store/index.js
  import { configureStore } from '@reduxjs/toolkit';
  import ratesReducer from './ratesSlice';
  import budgetReducer from './budgetSlice';

  export const store = configureStore({
    reducer: {
      rates: ratesReducer,
      budget: budgetReducer
    }
  });
  ```
- **API Service**: Axios for API calls.
  ```javascript
  // mobile/src/services/api.js
  import axios from 'axios';
  import { store } from '../store';
  import { setRates } from '../store/ratesSlice';

  const api = axios.create({ baseURL: 'http://localhost:8000/api' });
  export const fetchRates = async () => {
    const response = await api.get('/rates');
    store.dispatch(setRates(response.data));
    return response.data;
  };
  export const fetchTransactions = async () => {
    const response = await api.get('/transactions');
    return response.data;
  };
  ```
- **Donut Chart**: Budget visualization.
  ```javascript
  // mobile/src/components/DonutChart.js
  import { PieChart } from 'react-native-chart-kit';
  import { useSelector } from 'react-redux';
  import { Dimensions } from 'react-native';

  const DonutChart = () => {
    const budget = useSelector(state => state.budget);
    const data = budget.categories.map(cat => ({
      name: cat.name,
      amount: cat.spent,
      color: cat.color || '#'+(Math.random()*0xFFFFFF<<0).toString(16),
      legendFontColor: '#7F7F7F'
    }));
    return (
      <PieChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{ color: () => '#000' }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        testID="pie-chart"
      />
    );
  };
  ```
- **Dashboard**: Combines donut chart and transaction list.
  ```javascript
  // mobile/src/screens/DashboardScreen.js
  import { FlatList, Text, View } from 'react-native';
  import { useQuery } from '@tanstack/react-query';
  import { fetchTransactions } from '../services/api';
  import DonutChart from '../components/DonutChart';

  const DashboardScreen = () => {
    const { data: transactions } = useQuery(['transactions'], fetchTransactions);
    return (
      <View>
        <DonutChart />
        <FlatList
          data={transactions}
          renderItem={({ item }) => (
            <Text>{item.amount} {item.from_currency} ({item.converted_amount} {item.to_currency})</Text>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  };
  ```

### 2.3 Performance
- **Backend**: Cache rates in Redis (24-hour TTL). Index `user_id` and `created_at` in PostgreSQL.
- **Frontend**: Use `useMemo` for donut chart calculations, `FlatList` for transactions.

---

## 3. Setup Instructions

### 3.1 Local Development
1. **Clone Repo**:
   ```bash
   git clone https://github.com/your-org/travelbucks.git
   ```
2. **Backend Setup**:
   ```bash
   cd backend
   docker-compose up
   ```
   - Creates PostgreSQL, Redis, and Django services.
   - Runs at `http://localhost:8000`.
3. **Frontend Setup**:
   ```bash
   cd mobile
   npm install
   npm start
   ```
   - Starts React Native at `http://localhost:3000`.
4. **Environment Variables**:
   - Add `EXCHANGERATE_API_KEY` to `backend/.env` (get from exchangerateapi.com).

**Docker Compose**:
```yaml
version: "3.8"
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: travelbucks
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    ports: ["5432:5432"]
  redis:
    image: redis:6
    ports: ["6379:6379"]
  web:
    build: ./backend
    ports: ["8000:8000"]
    depends_on: ["db", "redis"]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/travelbucks
      CACHE_URL: redis://redis:6379/0
      EXCHANGERATE_API_KEY: your_api_key
  mobile:
    build: ./mobile
    ports: ["3000:3000"]
    depends_on: ["web"]
```

**Backend Dockerfile**:
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "travelbucks.wsgi:application", "--bind", "0.0.0.0:8000"]
```

**Mobile Dockerfile**:
```dockerfile
FROM node:16
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

**Requirements** (`backend/requirements.txt`):
```
django==4.2
djangorestframework==3.14
psycopg2-binary==2.9
requests==2.28
django-redis==5.2
gunicorn==20.1
pytest==7.4
pytest-django==4.5
```

**Package.json** (`mobile/package.json`):
```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^1.9",
    "@tanstack/react-query": "^4.29",
    "axios": "^1.4",
    "react-native": "^0.71",
    "react-native-chart-kit": "^6.12",
    "react-redux": "^8.0"
  },
  "devDependencies": {
    "@testing-library/react-native": "^12.1",
    "jest": "^29.5",
    "eslint": "^8.40"
  }
}
```

### 3.2 Deployment (Heroku)
1. Create Heroku app: `heroku create travelbucks-prod`.
2. Add add-ons: `heroku addons:create heroku-postgresql:hobby-dev`, `heroku addons:create heroku-redis:hobby-dev`.
3. Set environment variables:
   ```bash
   heroku config:set DATABASE_URL=<postgres-url>
   heroku config:set CACHE_URL=<redis-url>
   heroku config:set EXCHANGERATE_API_KEY=<your-key>
   ```
4. Deploy via GitHub Actions (see CI/CD below).

---

## 4. Development Plan (2 Weeks)

**Timeline**: 2 x 1-week sprints, daily tasks for 3 developers (D1, D2, D3).  
**Goal**: Deliver MVP (login, currency setup, budget, dashboard, transactions) by April 30, 2025.  
**Mentoring**: Daily 15-minute check-ins, 1-hour pair programming weekly, 30-minute Lunch & Learn weekly.

### Week 1: Foundation & Core Backend
**Goal**: Setup repo, build login, currency conversion, and transaction backend.

- **Day 1**:
  - **D1**: Create GitHub repo (`travelbucks`), add `backend` and `mobile` folders, setup `docker-compose.yml`, and GitHub Actions.
    ```bash
    git init
    git add .
    git commit -m "feat: initial repo setup"
    git push origin main
    ```
  - **D2**: Implement `User` model, login API (`/api/login`), and password hashing.
    ```python
    # travelbucks/views/user.py
    from django.contrib.auth.hashers import make_password, check_password
    from rest_framework.views import APIView
    from rest_framework.response import Response

    class LoginView(APIView):
        def post(self, request):
            user = User.objects.get(email=request.data['email'])
            if check_password(request.data['password'], user.password):
                return Response({"message": "Logged in"})
            return Response({"error": "Invalid credentials"}, status=401)
    ```
  - **D3**: Write `README.md` and setup Swagger UI (`/docs/`).
  - **Mentor**: Setup repo, explain Docker Compose.

- **Day 2**:
  - **D1**: Implement `DailyConverter` with exchangerateapi.com and Redis.
  - **D2**: Create `Budget` model and `/api/budgets` endpoint.
  - **D3**: Write `pytest` tests for `DailyConverter`.
    ```python
    # travelbucks/tests/test_conversion.py
    import pytest
    from services.conversion import DailyConverter

    @pytest.mark.django_db
    def test_daily_converter():
        amount = DailyConverter.convert(100, 'USD', 'JPY')
        assert isinstance(amount, float)
        assert amount > 0
    ```
  - **Mentor**: Pair program on `DailyConverter`.

- **Day 3**:
  - **D1**: Create `Transaction` model and `TransactionRepo`.
  - **D2**: Build `/api/transactions` endpoint with `BudgetService`.
  - **D3**: Write `pytest` tests for `/api/transactions`.
  - **Mentor**: Explain service layer, review PRs.

- **Day 4**:
  - **D1**: Setup Heroku app (`travelbucks-prod`), add PostgreSQL/Redis.
  - **D2**: Add indexes to `user_id`, `created_at` in PostgreSQL.
    ```sql
    CREATE INDEX idx_user_id ON transactions(user_id);
    CREATE INDEX idx_created_at ON transactions(created_at);
    ```
  - **D3**: Write ADR for Heroku (`docs/adr/2025-04-18-use-heroku.md`).
  - **Mentor**: Host Lunch & Learn on Django models.

- **Day 5**:
  - **D1**: Setup Sentry for backend error tracking.
    ```python
    # travelbucks/settings.py
    import sentry_sdk
    sentry_sdk.init(dsn="your-sentry-dsn", traces_sample_rate=1.0)
    ```
  - **D2**: Add JSON logging.
    ```python
    import logging, json_log_formatter
    formatter = json_log_formatter.JSONFormatter()
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    logging.getLogger().addHandler(handler)
    ```
  - **D3**: Test backend locally, fix bugs.
  - **Mentor**: Review progress, plan Week 2.

### Week 2: Frontend & Integration
**Goal**: Build React Native UI, integrate with backend, deploy.

- **Day 6**:
  - **D1**: Setup React Native with Redux Toolkit and React Query.
    ```javascript
    // mobile/src/App.js
    import { Provider } from 'react-redux';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { store } from './store';
    import DashboardScreen from './screens/DashboardScreen';

    const queryClient = new QueryClient();
    export default function App() {
      return (
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <DashboardScreen />
          </QueryClientProvider>
        </Provider>
      );
    }
    ```
  - **D2**: Build `LoginScreen` with email/password form.
    ```javascript
    // mobile/src/screens/LoginScreen.js
    import { useState } from 'react';
    import { TextInput, Button, View } from 'react-native';
    import axios from 'axios';

    const LoginScreen = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const login = async () => {
        try {
          await axios.post('http://localhost:8000/api/login', { email, password });
          alert('Logged in!');
        } catch (e) {
          alert('Login failed');
        }
      };
      return (
        <View>
          <TextInput placeholder="Email" onChangeText={setEmail} />
          <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry />
          <Button title="Login" onPress={login} />
        </View>
      );
    };
    ```
  - **D3**: Write Jest tests for `LoginScreen`.
    ```javascript
    // mobile/src/screens/__tests__/LoginScreen.test.js
    import { render, fireEvent } from '@testing-library/react-native';
    import LoginScreen from '../LoginScreen';

    test('submits login form', () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password');
      fireEvent.press(getByText('Login'));
      // Add mock axios to test API call
    });
    ```
  - **Mentor**: Explain Redux, review PRs.

- **Day 7**:
  - **D1**: Build `DonutChart` component with `react-native-chart-kit`.
  - **D2**: Create `DashboardScreen` with `FlatList` for transactions.
  - **D3**: Write Jest tests for `DonutChart`.
  - **Mentor**: Pair program on `DashboardScreen`.

- **Day 8**:
  - **D1**: Implement currency setup screen (search + flags).
    ```javascript
    // mobile/src/screens/CurrencySetupScreen.js
    import { useState } from 'react';
    import { TextInput, Button, View } from 'react-native';
    import { useDispatch } from 'react-redux';
    import { setRates } from '../store/ratesSlice';

    const CurrencySetupScreen = () => {
      const [homeCurrency, setHomeCurrency] = useState('USD');
      const [foreignCurrency, setForeignCurrency] = useState('JPY');
      const dispatch = useDispatch();
      const save = () => {
        dispatch(setRates({ [foreignCurrency]: 1 })); // Mock rates
        alert('Currencies saved');
      };
      return (
        <View>
          <TextInput placeholder="Home Currency (e.g., USD)" onChangeText={setHomeCurrency} />
          <TextInput placeholder="Foreign Currency (e.g., JPY)" onChangeText={setForeignCurrency} />
          <Button title="Save" onPress={save} />
        </View>
      );
    };
    ```
  - **D2**: Build budget setup screen (categories, amounts).
  - **D3**: Write ADR for GDPR (`docs/adr/2025-04-25-gdpr-compliance.md`).
  - **Mentor**: Host Lunch & Learn on React Native navigation.

- **Day 9**:
  - **D1**: Add transaction CRUD form to `DashboardScreen`.
    ```javascript
    // mobile/src/components/TransactionForm.js
    import { useState } from 'react';
    import { TextInput, Button, View } from 'react-native';
    import axios from 'axios';

    const TransactionForm = () => {
      const [amount, setAmount] = useState('');
      const [currency, setCurrency] = useState('JPY');
      const [category, setCategory] = useState('Food');
      const addTransaction = async () => {
        await axios.post('http://localhost:8000/api/transactions', {
          amount: parseFloat(amount),
          from_currency: currency,
          to_currency: 'USD',
          category
        });
        setAmount('');
      };
      return (
        <View>
          <TextInput placeholder="Amount" onChangeText={setAmount} keyboardType="numeric" />
          <TextInput placeholder="Currency" onChangeText={setCurrency} />
          <TextInput placeholder="Category" onChangeText={setCategory} />
          <Button title="Add Transaction" onPress={addTransaction} />
        </View>
      );
    };
    ```
  - **D2**: Setup Sentry for frontend errors.
    ```javascript
    // mobile/src/index.js
    import * as Sentry from '@sentry/react-native';
    Sentry.init({ dsn: 'your-sentry-dsn' });
    ```
  - **D3**: Write Detox E2E tests for login → transaction flow.
  - **Mentor**: Review frontend integration.

- **Day 10**:
  - **D1**: Deploy to Heroku, test production API.
  - **D2**: Fix bugs, polish UI (e.g., add retry for failed API calls).
  - **D3**: Update `README.md` with deployment steps.
  - **Mentor**: Demo app, prepare for launch.

---

## 5. Team Workflow

### 5.1 Mentoring
- **Daily Check-Ins**: 15 minutes to discuss blockers.
- **Pair Programming**: 1-hour session weekly (e.g., Day 2 for `DailyConverter`).
- **Lunch & Learn**: 30 minutes weekly (Week 1: Django models; Week 2: React Native navigation).
- **Notion Guide**: Create “TravelBucks Dev Guide” with tutorials (e.g., [Django REST Framework](https://www.django-rest-framework.org/), [React Native](https://reactnative.dev/docs/getting-started)).

### 5.2 Code Reviews
- **PR Template**:
  ```markdown
  **PR Checklist**:
  - [ ] Logic in services (backend) or hooks (frontend)
  - [ ] Tests included
  - [ ] Linter passes (flake8, eslint)
  - [ ] API docs updated (if endpoint changed)
  ```
- **Process**: Mentor reviews PRs, provides clear feedback (e.g., “Move this to `BudgetService`”).

### 5.3 Pitfalls & Solutions
- **API-Client Drift**: Generate TypeScript interfaces with `openapi-generator`.
  ```bash
  openapi-generator-cli generate -i backend/swagger.yaml -g typescript-axios -o mobile/src/api
  ```
- **Rate Fetch Failures**: Fallback to last-known rates in Redux.
  ```javascript
  // mobile/src/services/api.js
  export const fetchRates = async () => {
    try {
      const response = await api.get('/rates');
      store.dispatch(setRates(response.data));
      return response.data;
    } catch (e) {
      return store.getState().rates.rates; // Fallback
    }
  };
  ```
- **Time-Zone Bugs**: Store `created_at` in UTC, convert with `date-fns`.
  ```javascript
  import { format } from 'date-fns-tz';
  const utcDate = new Date('2025-04-18T10:00:00Z');
  const localDate = format(utcDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Tokyo' });
  ```

---

## 6. CI/CD

**GitHub Actions**:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_DB: travelbucks
          POSTGRES_USER: user
          POSTGRES_PASSWORD: pass
        ports: ["5432:5432"]
      redis:
        image: redis:6
        ports: ["6379:6379"]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with: { python-version: '3.10' }
      - run: pip install -r backend/requirements.txt
      - run: python backend/manage.py migrate
      - run: pytest backend --cov --cov-fail-under=80
      - run: npm install --prefix mobile && npm test --prefix mobile
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "travelbucks-prod"
          heroku_email: "team@example.com"
```

**Testing**:
- **Unit Tests**: `pytest` (Django), `Jest` (React Native).
- **Integration Tests**: Test API endpoints with PostgreSQL.
- **E2E Tests**: Detox for login → transaction flow (Day 9).
- **Coverage**: 80% minimum.

---

## 7. Documentation

- **README.md**:
  ```markdown
  # TravelBucks
  Multi-currency budgeting app for travelers.

  ## Quick Start
  1. Clone: `git clone https://github.com/your-org/travelbucks.git`
  2. Backend: `cd backend && docker-compose up`
  3. Frontend: `cd mobile && npm install && npm start`
  4. Env: Add `EXCHANGERATE_API_KEY` to `backend/.env`

  ## Deployment
  - Heroku app: `travelbucks-prod`
  - Add-ons: PostgreSQL, Redis
  ```
- **Architecture.md**:
  ```plantuml
  @startuml
  actor User
  User --> [React Native]
  [React Native] --> [Django API]
  [Django API] --> [Service Layer]
  [Service Layer] --> [Repository]
  [Repository] --> [PostgreSQL]
  [Service Layer] --> [Redis]
  [Service Layer] --> [exchangerateapi.com]
  @enduml
  ```
- **API Docs**: Swagger UI at `/docs/`.
  ```python
  # travelbucks/urls.py
  from rest_framework import permissions
  from drf_yasg.views import get_schema_view
  from drf_yasg import openapi

  schema_view = get_schema_view(
      openapi.Info(title="TravelBucks API", default_version='v1'),
      public=True,
      permission_classes=(permissions.AllowAny,),
  )
  urlpatterns = [
      path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
      # other URLs
  ]
  ```
- **ADRs**:
  - `docs/adr/2025-04-18-use-heroku.md`
  - `docs/adr/2025-04-25-gdpr-compliance.md`

---

## 8. Compliance

- **GDPR**:
  - Encrypt passwords with `make_password`.
  - Add privacy policy in app (e.g., “We store email and transactions securely”).
  - Allow account deletion via settings (post-MVP).
  ```python
  # travelbucks/views/user.py
  from django.contrib.auth.hashers import make_password
  class UserViewSet(ModelViewSet):
      def create(self, request):
          request.data['password'] = make_password(request.data['password'])
          return super().create(request)
  ```
- **PCI-DSS**: Plan for Stripe (post-MVP) using SDK to avoid storing card data.
- **ADR**:
  ```markdown
  # ADR 002: GDPR Compliance
  **Date**: 2025-04-25
  **Decision**: Encrypt passwords, add privacy policy, plan for account deletion.
  **Rationale**: Protects user data, complies with GDPR.
  ```

**Action**: Consult a legal expert before launch.

---

## 9. Monitoring

- **Backend**: Sentry for errors, JSON logging for analysis.
- **Frontend**: Sentry for JavaScript errors, Firebase Crashlytics for crashes.
- **Fallback UI**: Retryable errors (e.g., “Failed to load rates. Retry?”).
  ```javascript
  // mobile/src/screens/DashboardScreen.js
  import { Button } from 'react-native';
  const DashboardScreen = () => {
    const { data, error, refetch } = useQuery(['transactions'], fetchTransactions);
    if (error) return <Button title="Retry" onPress={refetch} />;
    // Render dashboard
  };
  ```

---

## 10. Next Steps
- **Immediate**:
  - Day 1: D1 sets up repo, D2 starts login, D3 writes `README.md`.
  - Mentor: Join daily check-ins, review PRs, host Lunch & Learn.
- **Post-MVP**:
  - Add dark mode, filters.
  - Implement Stripe for premium features.
  - Enhance GDPR with account deletion.

**Resources**:
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Native](https://reactnative.dev/docs/getting-started)
- [Heroku Docs](https://devcenter.heroku.com/)
- [Notion Dev Guide](https://your-notion-url/travelbucks-dev-guide)

**Contact**: Mentor available for questions via Slack/email.

---

**Let’s build TravelBucks and help travelers like Alex stay on budget!**