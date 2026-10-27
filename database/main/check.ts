// const Account = require('../collections/Account')
// const Role = require("../collections/Role")
// const Position = require("../collections/Position")
// const { Admin, Client } = require('../collections/Account')
// const now = Date.now()
//
// const administrator =
// {
//     _id: 'administrator',
//     name: 'Thanh Ngọc Musician 💎',
//     picture: null,
//     time: Date.now(),
//     password : '51311013e51adebc3c34d2cc591fefee',
//     active: Date.now(),
//     OTP_key: 'IRJFCQIWO53UQVTY',
//     OTP_activate: false,
// }
//
// const sysadmin =
// {
//     _id: 'sysadmin',
//     name: 'System Administrator',
//     icon: 'CatchingPokemon',
//     color: '#EC1576',
//     index: 0,
//
//     system: true,
//     client: 9999,
//     admin: 9999,
//     news: 9999,
//     art: 9999,
//     music: 9999,
//     application: 9999,
//     message: 9999,
// }
// const base =
// {
//     _id: 'default',
//     name: 'Mặc định',
//     icon: 'SupervisedUserCircle',
//     color: '#7D8291',
//     index: 1,
//
//     system: false,
//     client: 1,
//     admin: 1,
//     news: 1,
//     art: 1,
//     music: 1,
//     application: 1,
//     message: 1
// }

// name: 'Người dùng',
// icon: 'Public',
// color: '#0080ff',
// index: 2

// const createAccount = async () =>
// {
//     const account = new Account(administrator)
//     await account.save()
// }
// const createRole = async value =>
// {
//     const role = new Role(value)
//     await role.save()
// }
// const createPosition = async () =>
// {
//     const position = new Position({ account: administrator._id, role: sysadmin._id })
//     await position.save()
// }

// module.exports = async () =>
// {
//     const checkSysadmin = await Role.count({ _id: sysadmin._id })
//     if (checkSysadmin === 0) await createRole(sysadmin)
//
//     const checkBase = await Role.count({ _id: base._id })
//     if (checkBase === 0) await createRole(base)
//
//     const checkAccount = await Account.count({ _id: administrator._id })
//     if (checkAccount === 0) await createAccount()
//
//     const checkPosition = await Position.count({ account: administrator._id, role: sysadmin._id })
//     if (checkPosition === 0) await createPosition()
// }
