
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['module:metro-react-native-babel-preset'],
//     plugins: [
//       [
//         'module:react-native-dotenv',
//         {
//           envName: 'APP_ENV',
//           moduleName: '@env',
//           path: '.env',
//           blocklist: null,
//           allowlist: null,
//           safe: false,
//           allowUndefined: true,
//           verbose: false,
//         },
//       ],
//     ],
//   };
// };


