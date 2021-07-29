const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    me: async (_, args, { user }) => {
      if (user) {
        const user = await User.findOne({ _id: user._id });
        return user;
      }
      throw new AuthenticationError('You need to log in');
    }
  },
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      console.log(username, email, password);
      console.log('hello');
      const newUser = await User.create({ username, email, password });
      const token = signToken(newUser);

      return { token, newUser };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect username or password');
      }

      const passCheck = await user.isCorrectPassword(password);

      if (!passCheck) {
        throw new AuthenticationError('Incorrect username or password');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { bookData }, context) => {
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: { bookId } } },
          { new: true }
        )
        return updateUser;
      }
      throw new AuthenticationError('You need to log in first!');
    },
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        )
        return updateUser;
      }
      throw new AuthenticationError('You need to log in first!');
    }
  }
};

module.exports = resolvers;