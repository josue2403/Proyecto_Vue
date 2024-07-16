// LocalStorageService.js

const USER_STORAGE_KEY = 'usuarios';

// Función para guardar usuarios en localStorage
export function saveUsersToLocalStorage(users) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

// Función para obtener usuarios desde localStorage
export function getUsersFromLocalStorage() {
  const usersJson = localStorage.getItem(USER_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}


