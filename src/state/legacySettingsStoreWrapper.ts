import { settingsStore } from "./settingsStore";
export const subscribe = settingsStore.subscribe.bind(settingsStore);
export const getAppConfig = () => settingsStore.getState();
export const setState = settingsStore.setState.bind(settingsStore);
// You can add helpers here if components expect updateCompanyProfile, etc.
