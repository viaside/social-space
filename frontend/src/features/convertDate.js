

export default function convertDate(date) {
    // convert data from unix
    let unix_timestamp = date;
    var dates = new Date(unix_timestamp * 1000);
    var day = dates.getDate();
    var month = dates.getMonth() + 1;
    var year = dates.getFullYear();
    var hours = dates.getHours();
    var minutes = "0" + dates.getMinutes();
    return hours + ':' + minutes.substr(-2) + "  " + day + '.' + month + '.' + year;

}