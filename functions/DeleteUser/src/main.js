import { Client, Databases, Users } from 'node-appwrite';

export default async ({ req, res }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY);

  const database = new Databases(client);
  const users = new Users(client);

  if (req.method === 'POST') {
    const removedUserId = req.body.userId;
    console.log(removedUserId);
    // Only delete anonymous accounts
    if (req.body.provider !== 'anonymous')
      return res.json({
        success: true,
        message: 'Not deleting non-anonymous account.',
      });

    try {
      await database.deleteDocument(
        process.env.APPWRITE_DATABASE,
        'users',
        removedUserId
      );
    } catch (err) {
      console.log(`Can't delete user record.`);
    }

    try {
      await users.delete(removedUserId);
    } catch (e) {
      console.log(`Can't delete user account.`);
    }

    return res.json({
      success: true,
      message: 'User record deleted successfully',
    });
  }

  return res.json({
    success: false,
    message: 'Invalid Method',
  });
};
