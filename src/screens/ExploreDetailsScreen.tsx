////////////// Nicole coded whole file //////////////////

//import neccessary libraries
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import { RootStackParamList } from '../../App';
import { comment } from '../models';
import { getEcoEatsDBConnection, getCommentsForExplore, saveNewComment, likeComment, unlikeComment, checkIfUserLikedComment, getUserDetails } from '../../db-service';
import { UserContext } from '../../UserContext';

type ExploreDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ExploreDetails'
>;

type ExploreDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ExploreDetails'>;

type Props = {
  navigation: ExploreDetailsScreenNavigationProp;
  route: ExploreDetailsScreenRouteProp;
};

const { width: screenWidth } = Dimensions.get('window');


const ExploreDetailsScreen: React.FC<Props> = ({ route }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const { explore } = route.params;
  const { userId } = useContext(UserContext);

  const [comments, setComments] = useState<comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<{ [key: number]: boolean }>({});
  const [username, setUsername] = useState<string | null>(null);
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);

  // display comments 
  const loadComments = useCallback(async () => {
    try {
      const db = await getEcoEatsDBConnection();
      const loadedComments = await getCommentsForExplore(db, explore.explore_Id);
      setComments(loadedComments);
    } catch (error) {
      console.error('Failed to load comments', error);
    }
  }, [explore.explore_Id]);

  // get the username of the commenter
  const fetchUsername = useCallback(async () => {
    if (userId) {
      try {
        const db = await getEcoEatsDBConnection();
        const userDetails = await getUserDetails(db, userId);
        setUsername(userDetails.name);
      } catch (error) {
        console.error('Failed to fetch username', error);
      }
    }
  }, [userId]);

  // function to add a new comment, save new comment to database
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const db = await getEcoEatsDBConnection();
        const commentToSave: comment = {
          comment_Id: 0,
          explore_Id: explore.explore_Id,
          user_Name: username || 'Anonymous', 
          comment_Text: newComment,
          parent_comment_id: replyToCommentId,
          like_count: 0,
        };
        await saveNewComment(db, commentToSave);
        setNewComment('');
        setReplyToCommentId(null);
        loadComments();
      } catch (error) {
        console.error('Failed to save comment', error);
      }
    }
  };

  // handle like functions
  const handleLikeToggle = async (commentId: number) => {
    if (!userId) {
      console.log("User not logged in. Can't like comments.");
      return; // Prevent liking if user is not logged in
    }
    // check if user has already liked the comment
    try {
      const db = await getEcoEatsDBConnection();
      const hasLiked = await checkIfUserLikedComment(db, userId, commentId);
      //toggle like comment from like to dislike
      if (hasLiked) {
        await unlikeComment(db, userId, commentId);
      } else {
        await likeComment(db, userId, commentId);
      }

      loadComments();

      setLikedComments(prev => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  useEffect(() => {
    loadComments();
    fetchUsername();
  }, [loadComments, fetchUsername]);

  
  const renderComment = (comment: comment) => {
    const replies = comments.filter(c => c.parent_comment_id === comment.comment_Id);

    // display functionalities for reply comment, like comment and like count
    return (
      <View key={comment.comment_Id} style={[styles.commentContainer, comment.parent_comment_id ? styles.replyContainer : null]}>
        <Text style={styles.commentUser}>
          {comment.user_Name}:
        </Text>
        <Text style={styles.commentText}>{comment.comment_Text}</Text>
        <View style={styles.commentActions}>
          <Text style={styles.likeText}>{comment.like_count} {comment.like_count === 1 ? 'Like' : 'Likes'}</Text>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLikeToggle(comment.comment_Id)}
          >
            <Text style={styles.likeButtonText}>
              {likedComments[comment.comment_Id] ? 'Unlike' : 'Like'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.replyButton}
            onPress={() => {
              setNewComment(`@${comment.user_Name} `);
              setReplyToCommentId(comment.comment_Id);
            }}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        </View>
        {replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {replies.map(reply => renderComment(reply))}
          </View>
        )}
      </View>
    );
  };

  //display the explore details and show image, details and comments
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.contentContainer}>
          <Image
            style={styles.image}
            source={explore.picture ? { uri: explore.picture } : { uri: 'https://i.imgur.com/50exbMa.png' }}
          />
          <Text style={styles.title}>{explore.title}</Text>
          <Text style={styles.description}>{explore.description}</Text>
          <Text style={styles.dateCreated}>Date Created: {explore.date_created}</Text>

          <View style={styles.commentSection}>
            <Text style={styles.commentHeader}>Comments</Text>
            {comments.filter(c => !c.parent_comment_id).map((comment) => renderComment(comment))}
            {userId ? (
              <>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment"
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <Button title="Post Comment" onPress={handleAddComment} />
              </>
            ) : (
              <Text style={styles.loginPrompt}>Please log in to post a comment or like.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

//explore detail page styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(250,250,250)',
  },
  contentContainer: {
    padding: 20,
  },
  image: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.5,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  dateCreated: {
    fontSize: 14,
    color: 'gray',
  },
  commentSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  commentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentContainer: {
    marginBottom: 10,
  },
  replyContainer: {
    marginLeft: 20,
  },
  repliesContainer: {
    marginTop: 10,
    marginLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: 'lightgray',
    paddingLeft: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  commentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  likeText: {
    fontSize: 14,
    color: 'gray',
    marginRight: 10,
  },
  likeButton: {
    marginRight: 10,
  },
  likeButtonText: {
    fontSize: 14,
    color: '#007bff',
  },
  replyButton: {
    marginLeft: 10,
  },
  replyButtonText: {
    fontSize: 14,
    color: '#007bff',
  },
  commentInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  loginPrompt: {
    fontStyle: 'italic',
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ExploreDetailsScreen;
