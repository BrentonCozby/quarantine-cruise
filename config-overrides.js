const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackPlugin
} = require('customize-cra')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#13c2c2',
      '@secondary-color': '#22516e',
      '@link-color': '#13c2c2',
    },
  }),
  addWebpackPlugin(new AntdDayjsWebpackPlugin())
)
