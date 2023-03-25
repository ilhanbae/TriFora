export default function Convert_time(time_data) {
    const time_array = time_data.split("T");
    const return_time = time_array[0];
    return return_time;
}