import Keycloak, { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";
import { createContext, useEffect, useState } from "react";

/**
 * KeycloakConfig configures the connection to the Keycloak server.
 */
const keycloakConfig: KeycloakConfig = {
  realm: "TekClinic-Example",
  clientId: "webapp",
  url: "http://localhost:8180/auth",
};

const keycloakInitOptions: KeycloakInitOptions = {
  // Configure that Keycloak will check if a user is already authenticated (when opening the app or reloading the page). If not authenticated the user will be send to the login form. If already authenticated the webapp will open.
  onLoad: "login-required",
  checkLoginIframe: false
};

let keycloak: Keycloak.KeycloakInstance;
/**
 * AuthContextValues defines the structure for the default values of the {@link AuthContext}.
 */
interface AuthContextValues {
  /**
   * Whether or not a user is currently authenticated
   */
  isAuthenticated: boolean;
  /**
   * Function to initiate the logout
   */
  logout: () => void;
  /**
   * The name of the authenticated user
   */
  username: string;
  /**
  * Check if the user has the given role
  */
  hasRole: (role: string) => boolean;
}
//...This is outside of AuthContextProvider
const defaultAuthContextValues: AuthContextValues = {
  isAuthenticated: false,
  logout: () => { },
  username: "",
  hasRole: (role) => false,
};

/**
 * AuthContext is the context exposed by the {@link AuthContextProvider}.
 */
export const AuthContext = createContext<AuthContextValues>(
  defaultAuthContextValues
);

/**
 * The props that must be passed to create the {@link AuthContextProvider}.
 */
interface AuthContextProviderProps {
  /**
   * The elements wrapped by the auth context.
   */
  children: JSX.Element;
}

/**
 * AuthContextProvider is responsible for managing the authentication state of the current user.
 *
 * @param props
 */
const AuthContextProvider = (props: AuthContextProviderProps) => {
  // This is just here to check that we setup the provider correctly.
  console.log("rendering AuthContextProvider");

  // Creating the local state to keep track of the authentication
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function initializeKeycloak() {
      console.log("initialize Keycloak");
      try {
        const isAuthenticatedResponse = await keycloak.init(
          keycloakInitOptions
        );

        if (!isAuthenticatedResponse) {
          console.log(
            "user is not yet authenticated. forwarding user to login."
          );
          keycloak.login();
        }
        console.log("user already authenticated");
        setAuthenticated(isAuthenticatedResponse);
      } catch {
        console.log("error initializing Keycloak");
        setAuthenticated(false);
      }
    }

    if (typeof window !== 'undefined') {
      const Keycloak = require('keycloak-js');
      keycloak = Keycloak(keycloakConfig);
      // Initialize Keycloak here...
      initializeKeycloak();
    }

  }, []);

  const logout = () => {
    keycloak.logout();
  };

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    /**
     * Load the profile for of the user from Keycloak
     */
    async function loadProfile() {
      try {
        const profile = await keycloak.loadUserProfile();
        if (profile.firstName) {
          setUsername(profile.firstName);
        } else if (profile.username) {
          setUsername(profile.username);
        }
      } catch {
        console.log("error trying to load the user profile");
      }
    }

    // Only load the profile if a user is authenticated
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated])

  const hasRole = (role: string) => {
    return keycloak.hasRealmRole(role);
  };
  
  return (
    // Creating the provider and passing the state into it. Whenever the state changes the components using this context will be re-rendered.
    <AuthContext.Provider value={{ isAuthenticated, logout, username, hasRole }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;