export const GLOBAL_EVENT = {
  relogin_success: (data: any) => {
    const RE_LOGIN_CODE = data.data.RE_LOGIN_CODE;
    console.log(RE_LOGIN_CODE);
    localStorage.setItem("RE_LOGIN_CODE", RE_LOGIN_CODE);
  }
}
