export const isLoggedIn = () => {
    let token = localStorage.getItem('accessToken');
    if (token !== undefined && token !== '' && token !== null) {
        return true
    } else {
        return false
    }
}