const { User } = require('../models/User');
const { Book } = require('../models/Book');

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
    createUser: async (_, { username, email, password }) => {
      return await User.create({ username, email, password });
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
    saveBook: async (_,
      { authors, description, bookId, image, link, title }) => {
      return await Book.create({ authors, description, bookId, image, link, title });
    },
    deleteBook: async (_, { bookId }) => {
      return await Book.remove({ bookId: bookId });
    }
  }
};

module.exports = resolvers;