// import { ITask } from "../interfaces";
// import { baseUrl } from "../lib/network";

// export const onmessage = (event: MessageEvent<string>) => {
//   // Perform some calculations or tasks
//   // const result = processData(data);
//   // postMessage(result);
//   // console.log(event.data);
// };

// export const updateTaskAPI = async (taskValue: ITask) => {
//   try {
//     const resp = await fetch(baseUrl + "/api/task/update", {
//       method: "POST",
//       headers: headers,
//       credentials: "include",
//       body: JSON.stringify(taskValue),
//     });

//     await resp.json();
//   } catch (err) {
//     console.log(err);
//   }
// };

export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  'userID': ``,
};
