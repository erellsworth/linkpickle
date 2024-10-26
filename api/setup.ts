import { argv } from 'node:process';
import { db } from './utils/db';
import { Category, Comment, Link, Setting, Site, Token, User } from './models';
import { HashBrown } from './models/HashBrown.model';
import { LinkCategoryModel } from './models/LinkCategory.model';
import { Notification } from './models/Notification.model';
import { NotificationStatus } from './models/NotificationStatus.model';
import { SettingValueModel } from './models/SettingValue.model';

const userName = argv[2];
const adminEmail = argv[3];
const password = argv[4];

const prepare = async () => {
  if (!userName || !adminEmail || !password) {
    console.error(`Must specify admin username, email and password:
        npm run setup myUsername my@email.com mypassword
        `);
    return;
  }

  const tables = (await db.getQueryInterface().showAllSchemas()) as {
    [key: string]: string;
  }[];

  if (tables.length && tables.find((table) => table.name === 'Links')) {
    console.error('Tables already exist');
    return;
  }

  await Category.model.sync();
  await Comment.model.sync();
  await HashBrown.model.sync();
  await Link.model.sync();
  await Setting.model.sync();
  await Site.model.sync();
  await Token.model.sync();
  await User.model.sync();
  await LinkCategoryModel.sync();
  await Notification.model.sync();
  await NotificationStatus.model.sync();
  await SettingValueModel.sync();

  const userResult = await User.register(
    adminEmail,
    userName,
    password,
    'picklemaster',
  );

  if (!userResult.success) {
    console.error('Setup failed', userResult.error);
    return;
  }

  const admin = await User.findByEmail(adminEmail);

  if (!admin) {
    console.error('Something went horribly wrong');
    return;
  }

  try {
    await Setting.model.create(
      {
        SettingValue: {
          UserId: admin.id,
          SettingId: 1,
          value: 'true',
        },
        name: 'allowRegistration',
        label: 'Allow Registration',
        isAdmin: true,
        dataType: 'boolean',
      },
      {
        include: SettingValueModel,
      },
    );
    console.log('Setup complete');
  } catch (e) {
    console.error(e);
  }
};

prepare();
