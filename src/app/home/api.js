import localforage from 'localforage';

const ACCOUNT_NAMESPACE = 'ACCOUNT-';

export const saveAccount = (account) => {
  return localforage.setItem(
    ACCOUNT_NAMESPACE + account.id,
    account
  ).then((value) => {
    return value;
  }).catch((err) => {
    console.log('oops! the account was too far gone, there was nothing we could do to save him ', err);
  });
};

export const deleteAccount = (account) => {
  return localforage.removeItem(
    ACCOUNT_NAMESPACE + account.id
  ).then(() => {
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });
};
