import { Platform } from 'react-native';

let BASE_URL;

// Running in browser (Expo web)
if (Platform.OS === 'web') {
  BASE_URL = 'http://localhost:5000'; // backend on the same PC
}
// Android emulator (Android Studio / Expo Go in emulator)
else if (Platform.OS === 'android') {
  // Special host that means "this computer" from inside Android emulator
  BASE_URL = 'http://10.0.2.2:5000';
}
// iOS device (Expo Go on your iPhone over Wi-Fi)
else if (Platform.OS === 'ios') {
  // 👇 replace with your laptop's IP from `ipconfig`
  BASE_URL = 'http://192.168.56.1:5000';
} else {
  // Fallback
  BASE_URL = 'http://localhost:5000';
}

const API_BASE_URL = `${BASE_URL}/api`;

async function apiRequest(path, method = 'GET', body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, options);
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      const message = (data && data.message) || text || 'Request failed';
      throw new Error(message);
    }
    return data;
  } catch (err) {
    console.log('API error ->', path, err.message);
    throw err;
  }
}

export function apiPost(path, body) {
  return apiRequest(path, 'POST', body);
}

export function apiGet(path) {
  return apiRequest(path, 'GET');
}

export function apiPut(path, body) {
  return apiRequest(path, 'PUT', body);
}
// NOTE: On a real device, change localhost to your computer's IP, e.g.
// const API_BASE_URL = 'http://192.168.1.10:5000/api';

// async function apiRequest(path, method = 'GET', body) {
//   const options = {
//     method,
//     headers: { 'Content-Type': 'application/json' },
//   };
//   if (body) {
//     options.body = JSON.stringify(body);
//   }

//   const res = await fetch(`${API_BASE_URL}${path}`, options);
//   const text = await res.text();
//   let data;
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch {
//     data = text;
//   }

//   if (!res.ok) {
//     const message = (data && data.message) || text || 'Request failed';
//     throw new Error(message);
//   }
//   return data;
// }

// export function apiPost(path, body) {
//   return apiRequest(path, 'POST', body);
// }

// export function apiGet(path) {
//   return apiRequest(path, 'GET');
// }

// export function apiPut(path, body) {
//   return apiRequest(path, 'PUT', body);
// }
