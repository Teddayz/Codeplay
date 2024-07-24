const User = require('../models/user');

const expTable = [20, 50, 100, 300, 600, 1000];

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
        return res.render('profile', { user: currentUser, error_msg, expTable });
      }
  
      // Check if the friend request has already been sent or if the user is already a friend
      if (friend.friendRequests.includes(currentUser._id) || currentUser.friends.includes(friend._id)) {
        const error_msg = 'Friend request already sent or user is already a friend';
        console.log(error_msg);
        return res.render('profile', { user: currentUser, error_msg, expTable});
      }
  
      // Add friend request to the friend's list
      friend.friendRequests.push(currentUser._id);
      await friend.save();
  
      const success_msg = 'Friend request sent';
      console.log(success_msg);
      res.render('profile', { user: currentUser, success_msg, expTable });
  
    } catch (err) {
      console.error('Error sending friend request:', err);
      const error_msg = 'Error sending friend request';
      res.render('profile', { user: req.user, error_msg, expTable });
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

module.exports = {
    getProfile,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest
};