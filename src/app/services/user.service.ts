import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_ID_KEY = 'user_id';

  private apiUrl =
    'https://ipgeolocation.abstractapi.com/v1/?api_key=d5cac7efc1f849d8b2d4d9c9106187b8';

  constructor(private http: HttpClient) {}

  getUserInfo(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  storeUserInfoInSessionStorage(ip: string, isp: string, city: string): void {
    const userInfo = { ip, isp, city };
    const userInfoJson = JSON.stringify(userInfo);
    sessionStorage.setItem('clientInfo', userInfoJson);
  }

  getUserInfoFromSessionStorage(): any {
    const clientInfoJson = sessionStorage.getItem('clientInfo');
    return clientInfoJson ? JSON.parse(clientInfoJson) : null;
  }

  getUserId(): string {
    let userId = localStorage.getItem(this.USER_ID_KEY);
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem(this.USER_ID_KEY, userId);
    }
    return userId;
  }
}
