import { create } from "zustand";
import { persist } from "zustand/middleware";
import secure from "./secure";
import api, { ADDRESS } from "./api";
import utils from "./utils";

const useGlobal = create((set, get) => ({
  //---------------------
  //   Initialization
  //---------------------

  initialized: false,

  init: async () => {
    const credentials = await secure.get("credentials");
    if (credentials) {
      try {
        const response = await api({
          method: "POST",
          url: "/chat/signin/",
          data: {
            username: credentials.username,
            password: credentials.password,
          },
        });
        if (response.status !== 200) {
          throw "Authentication error";
        }
        const user = response.data.user;
        const tokens = response.data.tokens;

        secure.set("tokens", tokens);

        set((state) => ({
          initialized: true,
          authenticated: true,
          user: user,
        }));
        return;
      } catch (error) {
        console.log("useGlobal.init: ", error);
      }
    }
    set((state) => ({
      initialized: true,
    }));
  },

  //---------------------
  //   Authentication
  //---------------------

  isNewUser: false,
  authenticated: false,
  user: {},

  login: (credentials, user, tokens) => {
    secure.set("credentials", credentials);
    secure.set("tokens", tokens);
    set((state) => ({
      authenticated: true,
      user: user,
    }));
  },

  logout: () => {
    secure.wipe();
    set((state) => ({
      authenticated: false,
      user: {},
    }));
  },
}));


export const useAuthStore = create((set) => ({
	token: null,
	isNewUser: false,
	user: null,
	hydrated: false,
  
	setAuth: ({ token, isNewUser, user }) => {
	  secure.set("auth", { token, isNewUser, user });
	  set({ token, isNewUser, user });
	},
	
	//markSetupComplete: () => set({ isNewUser: false }),

	hydrate: async () => {
	  const data = await secure.get("auth");
	  console.log("Hydrate Data:", data)
	  if (data) {
		set({ ...data, hydrated: true });
	  } else {
		set({ hydrated: true });
	  }
	},
  
	logout: () => {
	  secure.remove("auth");
	  console.log("Logging Out")
	  set({ token: null, isNewUser: false, user: null });
	},
  }));

export default  useGlobal; useAuthStore;
