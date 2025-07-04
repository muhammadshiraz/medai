// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  //apiEndpoint: "http://ec2-54-145-40-116.compute-1.amazonaws.com:5656/ontimizeweb/services/rest",
  apiEndpoint: "http://localhost:5656/ontimizeweb/services/rest",
  production: false,
  versions: {
    core: '15.2.10',
    charts: '"15.0.0-beta.1',
    filemanager: '15.0.0',
    map: '15.0.0',
    report: '15.0.1'
  }
}