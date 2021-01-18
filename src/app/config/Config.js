import React from "react";

export const API_URL = "http://localhost:8080";

export function removeStorageItem(name) {
    localStorage.removeItem(name);
}

export function getStorageItem(name) {
    return JSON.parse(localStorage.getItem(name));
}

export function setStorageItem(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

export function isLogged() {
    if (getStorageItem("token")) {
        return true;
    }

    return false;
}

export function logout() {
    removeStorageItem("token");
}