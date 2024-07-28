# Moneytracker
Moneytracker is a dead-simple way to keep track of the fiat or crypto assets you have across different entities.
Currently, moneytracker is in early development, and only supports front-end functionality. This means that all behaviour
is driven from localstorage, and no data is sent to or persisted any server.

# Running the app
```shell
corepack enable
pnpm i
cd website
pnpm dev
```
If you're trying to use the app locally, you'll need to find a way to circumvent CORS restrictions.
One possibility if you're on Chrome is this [extension](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf),
but use it at your own risk.

# Using the app
1. Add a holding entity (literally 'what' holds your money). This can be anything from a bank account to a crypto wallet
2. You'll also need to add the asset name, the amount of the asset, and the symbol of the asset
   - For example, if you have 1000 USD in your DBS bank account, you would add a holding entity with the name 'DBS Bank', the asset name 'USD', the amount '1000', and the symbol 'USD' 
3. That's it!


