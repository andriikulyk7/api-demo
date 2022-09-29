export class HttpUtils {
  public static get cookieOptions() {
    return {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };
  }
}
