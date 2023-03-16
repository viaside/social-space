export default async function getProfilePhoto(UserId) {
    const response = await fetch("https://localhost:7013/api/telegram/GetUserPhoto/" + UserId);
    const message = await response.json();
    return message.responseData;
}