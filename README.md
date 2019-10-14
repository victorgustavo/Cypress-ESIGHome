# Suite de testes automatizados do QuarkClinic

## Rodando localmente

```sh
env CYPRESS_BASE_URL='http://localhost:8080/app' npm run cy:open
-- or
env $( cat .env.local ) npm run cy:open
```
