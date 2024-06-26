const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { EMAIL_ALREADY_TAKEN } = require('../../../core/errors');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Verify email
  const emailTaken = await isEmailTaken(email);
  if (emailTaken) {
    throw EMAIL_ALREADY_TAKEN;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  // Verify email
  const emailTaken = await isEmailTaken(email);
  if (emailTaken && user.email !== email) {
    throw EMAIL_ALREADY_TAKEN;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

async function isEmailTaken(email) {
  return usersRepository.isEmailTaken(email);
}

async function changePasswordSchema(
  id,
  oldPassword,
  newPassword,
  password_confirm
) {
  if (password_confirm != newPassword) {
    throw new Error('Invalid New Password');
  }

  const getUserId = await usersRepository.getUser(id);
  const comparePassword = await passwordMatched(oldPassword, getUserId.password);

  if (!comparePassword) {
    throw new Error('Wrong Password');
  }

  const hashedPassword = await hashPassword(newPassword);
  await usersRepository.getPassword(id, hashedPassword);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  isEmailTaken,
  changePasswordSchema,
};
