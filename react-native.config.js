////////////////////Cuong////////////////////////////////
module.exports = {
    dependencies: {
      "react-native-sqlite-storage": {
        platforms: {
          android: {
            sourceDir:
              "../node_modules/react-native-sqlite-storage/platforms/android-native",
            packageImportPath: "import io.liteglue.SQLitePluginPackage;",
            packageInstance: "new SQLitePluginPackage()"
          }
        }
      }
    },
    assets: ['./node_modules/react-native-vector-icons/MaterialCommunityIcons'],
  };
  //only additions of dependencies or assets, dont remove anything