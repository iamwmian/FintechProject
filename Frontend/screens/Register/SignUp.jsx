import { useLayoutEffect, useState } from "react"
import { 
	Keyboard,
	KeyboardAvoidingView,
	SafeAreaView, 
	Text, 
	View, 
	TouchableWithoutFeedback,
	ScrollView
} from "react-native"
import Input from "../../common/Input"
import Button from "../../common/Button"
import api from "../../core/api"
import utils from "../../core/utils"
import useGlobal from "../../core/global"

function SignUpScreen({ navigation }) {
	const [email,  setEmail]  = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName,  setLastName]  = useState('')
	const [password1, setPassword1] = useState('')
	const [password2, setPassword2] = useState('')

	const [emailError,  setEmailError]  = useState('')
	const [firstNameError, setFirstNameError] = useState('')
	const [lastNameError,  setLastNameError]  = useState('')
	const [password1Error, setPassword1Error] = useState('')
	const [password2Error, setPassword2Error] = useState('')

	const login = useGlobal(state => state.login)

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false
		})
	}, [])

	function onSignUp() {
		// Check email
		const failEmail = !email || email.length < 5
		if (failEmail) {
			setEmailError('Email must be >= 5 characters')
		}
		// Check firstName
		const failFirstName = !firstName
		if (failFirstName) {
			setFirstNameError('First Name was not provided')
		}
		// Check last Name
		const failLastName = !lastName
		if (failLastName) {
			setLastNameError('Last Name was not provided')
		}
		// Check password1
		const failPassword1 = !password1 || password1 < 8
		if (failPassword1) {
			setPassword1Error('Password is too short')
		}
		// Check password2
		const failPassword2 = password1 !== password2
		if (failPassword2) {
			setPassword2Error('Passwords don\'t match')
		}
		// Break out of the fucntion if there were any issues
		if (failEmail ||
				failFirstName ||
				failLastName ||
				failPassword1 ||
				failPassword2) {
			return
		}

		// Make signin request
		api({
			method: 'POST',
			url: '/api/signup/',
			data: {
				email: email,
				first_name: firstName,
				last_name: lastName,
				password: password1
			}
		})
		.then(response => {
			utils.log('Sign Up:', response.data)
			
			const credentials = {
				email: email,
				password: password1
			}
			login(
				credentials,
				response.data.user,
				response.data.tokens
			)
		})
		.catch(error => {
			if (error.response) {
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(error.request);
			} else {
				console.log('Error', error.message);
			}
			console.log(error.config);
		})
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
				{/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
				<TouchableWithoutFeedback>
					<ScrollView>
						<View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16 }}>
							<Text
								style={{
									textAlign: 'center',
									marginBottom: 24,
									fontSize: 36,
									fontWeight: 'bold'
								}}
							>
								Sign Up
							</Text>
							<Input
								title='Email'
								value={email}
								error={emailError}
								setValue={setEmail}
								setError={setEmailError}
							/>
							<Input
								title='First Name'
								value={firstName}
								error={firstNameError}
								setValue={setFirstName}
								setError={setFirstNameError}
							/>
							<Input
								title='Last Name'
								value={lastName}
								error={lastNameError}
								setValue={setLastName}
								setError={setLastNameError}
							/>
						
							<Input
								title='Password'
								value={password1}
								error={password1Error}
								setValue={setPassword1}
								setError={setPassword1Error}
								secureTextEntry={true}
							/>
							<Input
								title='Retype Password'
								value={password2}
								error={password2Error}
								setValue={setPassword2}
								setError={setPassword2Error}
								secureTextEntry={true}
							/>
							<Button title='Sign Up' onPress={onSignUp} />
							<Text style={{ textAlign: 'center', marginTop: 40 }}>
								Already have an account? <Text
									style={{ color: 'blue' }}
									onPress={() => navigation.navigate("SignIn")}
								>
									Sign In
								</Text>
							</Text>
						
							<Text style={{textAlign : 'center', marginTop : 40}}>Or</Text>
							<Button title='Or Sign Up With Google' onPress={onSignUp} />
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

export default SignUpScreen