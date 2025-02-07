// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../../App';

// type ViewDataScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'ViewData'
// >;

// type Props = {
//   navigation: ViewDataScreenNavigationProp;
// };

// const ViewDataScreen: React.FC<Props> = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Go to Home Screen"
//         onPress={() => navigation.navigate('Home')}
//       />
//       <Button
//         title="Go to Details Screen"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ViewDataScreen;
//----------------------------------------------------------------
// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * Generated with the TypeScript template
//  * https://github.com/react-native-community/react-native-template-typescript
//  *
//  * @format
//  */
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   Button,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   useColorScheme,
//   View,
// } from 'react-native';
// import { ToDoItemComponent } from './ToDoItem';
// import { ToDoItem } from './models';
// import { getDBConnection, getTodoItems, saveTodoItems, createTable, deleteTodoItem } from './db-service';
// const App = () => {
//   const isDarkMode = useColorScheme() === 'dark';
//   //setTodos() will save the value in it to the varaible 'todos'
//   //as below, setTodos(initTodos) will save the arrays with objects to todos
//   // with index.ts, which defined ToDoItem as an object, this makes the save the paramters that matches the format defined.
//   //This is ensured by the 'ToDoItem[]'
//   const [todos, setTodos] = useState<ToDoItem[]>([]);

//   //similar to the above, 
//   //if i run 'setNewTodo("moo");', the variable newTodo will now contains the string "moo".
//   const [newTodo, setNewTodo] = useState('');
//   let db;
//   //loadDataCallback initialise a connection to the db and create a data table in that db
//   const loadDataCallback = useCallback(async () => {
//     try {
//       const initTodos = [{ id: 0, value: 'go to shop' }, { id: 1, value: 'eat at least a one healthy foods' }, { id: 2, value: 'Do some exercises' }];
//       // 'await' will pause the execution of the code line until the code/function after it has executed.
//       db = await getDBConnection();
//       //await createTable(db);
//       const storedTodoItems = await getTodoItems(db);
//       if (storedTodoItems.length) {
//         setTodos(storedTodoItems);
//       } else {
//         await saveTodoItems(db, initTodos);
//         setTodos(initTodos);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }, []);

//   useEffect(() => {
//     loadDataCallback();
//   }, [loadDataCallback]);
//   //useEffect(() =>{
//   // code to be run
//   //}, [variables that if changed, will re runs the code above]);
//   //Thus, the value in the brackets ensure we will always use the latest value.

//   const addTodo = async () => {
//     // newTodo.trim() will removes the white spaces from the string
//     //eg just for demo "   pee  ".trim() --> "pee"
//     //Thus, '!newTodo.trim()' is used to check if a string exist
//     if (!newTodo.trim()) return;
//     try {
//     // '...todos' is basically means list the array todos's elements in this section
//     //eg
//     // const todos = [
//     //     { id: 1, value: 'Buy groceries' },
//     //     { id: 2, value: 'Walk the dog' }
//     //   ];
      
//     //   const newTodos = [...todos, { id: 3, value: 'Read a book' }];
//     //output --> newTodos = [{ id: 1, value: 'Buy groceries' },{ id: 2, value: 'Walk the dog' },{ id: 3, value: 'Read a book' }]
//       const newTodos = [...todos, {
//         //id: ...  will save whatever value after this to id

//         // the ? is basically a if-else statement
//         //if todos.length have a value, it will execute todos.reduce()
//         //if todos.length returns a undefined value, which means todos is empty, will return 0

//         //todos.reduce() will iterate over the todos's elements
//         // cur represent the element being iterated over
//         // acc (accumulator) keeps track of all elements iterated before.
//         //thus, the (cur.id > acc.id) means "is the current element's id larger than all id recorded?"
//         //but essentially, the 'todos.reduce(...)' will return the element with the highest id value
//         //'todos.reduce(...).id' will allows us to access the id of the element with the largest id value.
//         //'todos.reduce(...).id + 1' will acts as an autoincrement
//         id: todos.length ? todos.reduce((acc, cur) => {
//           if (cur.id > acc.id) return cur;
//           return acc;
//         }).id + 1 : 0, value: newTodo
//         //'value: newTodo' will assign the latest element's value with the string in newTodo
//       }];
//       setTodos(newTodos);
//       const db = await getDBConnection();
//       await saveTodoItems(db, newTodos);
//       setNewTodo('');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const deleteItem = async (id: number) => {
//     try {
//       const db = await getDBConnection();
//       await deleteTodoItem(db, id);
//       todos.splice(id, 1);
//       setTodos(todos.slice(0));
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   //what we can get from above is that they saves the retrieved items from the database into an array
//   //That array acts as a 'window' to the database.
//   //so when a new item is added/removed, we will do the same thing to the array
//   //this is they use the values in the array todo to display items to the users
//   //having the array and database system likes this will ensure we dont retrieve from the database again whenever we load something
//   //saves the loading time

//   return (
//     <SafeAreaView>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic">
//         <View style={[styles.appTitleView]}>
//           <Text style={styles.appTitleText}> ToDo Application : {String(db)} </Text>
//         </View>
//         <View>
//             {/* todos.map(todo) will iterate over the todos array */}
//             {/* and each iteration element is saved as todo */}
//           {todos.map((todo) => (
//             // for this, refer to ToDoItem.tsx
//             // but basically, this sets up as a format on how to display these info
//             //its like a function
//             <ToDoItemComponent key={todo.id} todo={todo} deleteItem={deleteItem} />
//           ))}
//         </View>
//         <View style={styles.textInputContainer}>
//           <TextInput style={styles.textInput} value={newTodo} onChangeText={text => setNewTodo(text)} />
//           <Button
//             onPress={addTodo}
//             title="Add ToDo"
//             color="#841584"
//             accessibilityLabel="add todo item"
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   appTitleView: {
//     marginTop: 20,
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   appTitleText: {
//     fontSize: 24,
//     fontWeight: '800'
//   },
//   textInputContainer: {
//     marginTop: 30,
//     marginLeft: 20,
//     marginRight: 20,
//     borderRadius: 10,
//     borderColor: 'black',
//     borderWidth: 1,
//     justifyContent: 'flex-end'
//   },
//   textInput: {
//     borderWidth: 1,
//     borderRadius: 5,
//     height: 30,
//     margin: 10,
//     backgroundColor: 'pink'
//   },
// });
// export default App;
//----------------------------------------------------------------

//THIS PAGE IS NOT USED IN THE ECOEATS APP. ITS JUST THE BASE FILE FOR TESTING
// BUT CUONG CODED 99.99% OF THIS

//----------------------------------------------------------------
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

import { ToDoItemComponent } from '../modules/ToDoItem';
import { ToDoItem } from '../models';
import { getDBConnection, getTodoItems, saveTodoItems, createTable, deleteTodoItem } from '../../db-service';

type ViewDataScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ViewData'
>;

type Props = {
  navigation: ViewDataScreenNavigationProp;
};

const ViewDataScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  let db;
  const loadDataCallback = useCallback(async () => {
    try {
      const initTodos = [{ id: 0, value: 'go to shop' }, { id: 1, value: 'eat at least a one healthy foods' }, { id: 2, value: 'Do some exercises' }];
      db = await getDBConnection();
      const storedTodoItems = await getTodoItems(db);
      if (storedTodoItems.length) {
        setTodos(storedTodoItems);
      } else {
        await saveTodoItems(db, initTodos);
        setTodos(initTodos);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

    useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback,todos]);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const newTodos = [...todos, {
        id: todos.length ? todos.reduce((acc, cur) => {
          if (cur.id > acc.id) return cur;
          return acc;
        }).id + 1 : 0, value: newTodo
      }];
      setTodos(newTodos);
      const db = await getDBConnection();
      await saveTodoItems(db, newTodos);
      setNewTodo('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const db = await getDBConnection();
      await deleteTodoItem(db, id);
      todos.splice(id, 1);
      setTodos(todos.slice(0));
    } catch (error) {
      console.error(error);
    }
  };

  return (
        <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <View style={[styles.appTitleView]}>
          <Text style={styles.appTitleText}> ToDo Application : {String(db)} </Text>
        </View>
        <View>
          {todos.map((todo) => (
            <ToDoItemComponent key={todo.id} todo={todo} deleteItem={deleteItem} />
          ))}
        </View>
        <View style={styles.textInputContainer}>
          <TextInput style={styles.textInput} value={newTodo} onChangeText={text => setNewTodo(text)} />
          <Button
            onPress={addTodo}
            title="Add ToDo"
            color="#841584"
            accessibilityLabel="add todo item"
          />
        </View>
        <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Home Screen"
        onPress={() => navigation.navigate('Home')}
      />
      <Button
        title="Go to Details Screen"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800'
  },
  textInputContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'flex-end'
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
    margin: 10,
    backgroundColor: 'pink'
  },
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewDataScreen;