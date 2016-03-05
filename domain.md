In order to point your custom domain to https://tsur.github.io/ just follow the steps below:

* A. Create a `CNAME` file at the root containing `my.custom.domain`
* B. Go to your hosting provider a create two A records with host to `@` and pointing to `192.30.252.153` and `192.30.252.154` (Note: those IP may change in the future)

when domain is expired, just delete `CNAME` file and then use it as usual https://tsur.github.io/
