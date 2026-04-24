import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let authToken = null;
let currentUser = null;

function resolveHostFromExpo() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.expoGoConfig?.debuggerHost;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0];
}

function resolveBaseURL() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  const expoHost = resolveHostFromExpo();
  if (expoHost) {
    return `http://${expoHost}:3000/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }

  return 'http://127.0.0.1:3000/api';
}

export const apiBaseURL = resolveBaseURL();

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export function setAuthToken(token) {
  authToken = token || null;
}

export function getAuthToken() {
  return authToken;
}

export function setCurrentUser(user) {
  currentUser = user || null;
}

export function getCurrentUser() {
  return currentUser;
}

export function clearAuthToken() {
  authToken = null;
  currentUser = null;
}

export default api;
