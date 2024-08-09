const User = require('../models/user');

const expTable = [
  20, 23, 26, 30, 35, 40, 46, 53, 61, 70, 81, 93, 107, 123, 142, 163, 187, 215,
  248, 285, 327, 376, 433, 498, 573, 658, 757, 871, 1001, 1152, 1324, 1523,
  1751, 2014, 2316, 2664, 3063, 3522, 4051, 4658, 5357, 6161, 7085, 8148, 9370,
  10775, 12392, 14250, 16388, 18846, 21673, 24924, 28663, 32962, 37906, 43592,
  50131, 57651, 66299, 76243, 87680, 100832, 115957, 133350, 153353, 176356,
  202809, 233230, 268215, 308447, 354714, 407922, 469110, 539476, 620398,
  713457, 820476, 943547, 1085079, 1247841, 1435018, 1650270, 1897811, 2182482,
  2509855, 2886333, 3319283, 3817175, 4389752, 5048214, 5805447, 6676263,
  7677703, 8829358, 10153762, 11676827, 13428351, 15442603, 17758994, 20422843
];

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friends friendRequests');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profile', { user, expTable, title: "Profile Page" });
    } catch (err) {
        res.status(500).send('Unable to get your profile');
    }
}

const sendFriendRequest = async (req, res) => {
    try {
      const { friendUsername } = req.body;
  
      // Find the current user
      const currentUser = await User.findById(req.user._id);

      if (currentUser.username === friendUsername) {
        const error_msg = 'You cannot send a friend request to yourself';
        console.log(error_msg);
        return res.render('index', { user: currentUser, error_msg, expTable });
      }
  
      // Find the friend by username
      const friend = await User.findOne({ username: friendUsername });
  
      if (!friend) {
        const error_msg = 'User not found';
        console.log(error_msg);
        return res.render('index', { user: currentUser, error_msg, expTable });
      }
  
      // Check if the friend request has already been sent or if the user is already a friend
      if (friend.friendRequests.includes(currentUser._id) || currentUser.friends.includes(friend._id)) {
        const error_msg = 'Friend request already sent or user is already a friend';
        console.log(error_msg);
        return res.render('index', { user: currentUser, error_msg, expTable});
      }
  
      // Add friend request to the friend's list
      friend.friendRequests.push(currentUser._id);
      await friend.save();
  
      const success_msg = 'Friend request sent';
      console.log(success_msg);
      res.render('index', { user: currentUser, success_msg, expTable });
  
    } catch (err) {
      console.error('Error sending friend request:', err);
      const error_msg = 'Error sending friend request';
      res.render('index', { user: req.user, error_msg, expTable });
    }
  };
  
  const acceptFriendRequest = async (req, res) => {
    try {
      const friendId = req.params.id;
  
      // Find the current user
      const currentUser = await User.findById(req.user.id);
  
      // Find the friend by id
      const friend = await User.findById(friendId);
  
      if (!friend) {
        const error_msg = 'User not found';
        console.log(error_msg);
        return res.render('profile', { user: currentUser, error_msg, expTable });
      }
  
      // Remove friend request from current user's list and add friend to friends list
      currentUser.friendRequests = currentUser.friendRequests.filter(requestId => !requestId.equals(friend._id));
      currentUser.friends.push(friend._id);
      await currentUser.save();
  
      // Add current user to friend's friends list
      friend.friends.push(currentUser._id);
      await friend.save();
  
      const success_msg = 'Friend request accepted';
      console.log(success_msg);
      res.render('profile', { user: currentUser, success_msg, expTable });
  
    } catch (err) {
      console.error('Error accepting friend request:', err);
      const error_msg = 'Error accepting friend request';
      console.log(error_msg);
      res.render('profile', { user: req.user, error_msg, expTable });
    }
  };
  
  const rejectFriendRequest = async (req, res) => {
    try {
        const friendId = req.params.id;
      // Find the current user
      const currentUser = await User.findById(req.user.id);
  
      // Find the friend by id
      const friend = await User.findById(friendId);
  
      if (!friend) {
        const error_msg = 'User not found';
        return res.render('profile', { user: currentUser, error_msg, expTable });
      }
  
      // Remove friend request from current user's list
      currentUser.friendRequests = currentUser.friendRequests.filter(requestId => !requestId.equals(friend._id));
      await currentUser.save();
  
      const success_msg = 'Friend request rejected';
      res.render('profile', { user: currentUser, success_msg, expTable });
  
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      const error_msg = 'Error rejecting friend request';
      res.render('profile', { user: req.user, error_msg, expTable });
    }
  };

  const removeFriend = async (req, res) => {
    try {
      const friendId = req.params.id;
      const currentUser = await User.findById(req.user.id);
      const friend = await User.findById(friendId);
      //Remove friend 
      currentUser.friends = currentUser.friends.filter(friend => friend.toString() !== friendId);
      await currentUser.save();
      //Remove current user from friend
      friend.friends = friend.friends.filter(friend => friend.toString() !== req.user._id.toString());
      await friend.save();
      const success_msg = "Friend Removed";
      console.log(success_msg);

      res.render('index', { user: currentUser, success_msg, expTable });
    } catch(err) {
      console.error('Error deleting friend:', err);
      const error_msg = 'Error deleting friend';
      res.render('index', { user: req.user, error_msg, expTable });
    }
  }

module.exports = {
    getProfile,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend
};