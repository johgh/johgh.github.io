// TODO (or not: pasar a limpio y subir a GS.gq)


-- NOTAS API (extraído de https://devnotes.net/rest-api-development-with-lumen-part-4-oauth2-authentication-seeding)
(proyecto: https://github.com/hasib32/rest-api-with-lumen)

Repositorio (separa modelo de su implementación)


REPOSITORIO GENÉRICO

// interfaz
interface BaseRepository
- interfaz genérica. NO TOCAR ESTE CÓDIGO

// implementación del repositorio GENÉRICO
abstract class AbstractEloquentRepository implements BaseRepository
- métodos Eloquent abstractos. Deberemos tirar de ellos (desde nuestro repo con ::parent) en lugar de usar querybuilder en lo posible. Genera UUID en lugar de IDs. NO TOCAR ESTE CÓDIGO

USUARIO

// modelo ELOQUENT
class User extends Model implements AuthenticatableContract, AuthorizableContract
-> Se usa para definir atributos,relaciones eloquent únicamente. Los métodos de DB deben ir en EloquentUserRepository

// interfaz de usuario (necesario, igual nos lo podemos ahorrar?)
interface UserRepository extends BaseRepository
-> Interfaz que dice los métodos mínimos que debe tener el repo usuario es INDEPENDIENTE DE ELOQUENT

// implementación del modelo usuario con ELOQUENT
class EloquentUserRepository extends AbstractEloquentRepository implements UserRepository -> (    protected $modelName = User::class; ) 
-> Aquí está la lógica de DB. Se usa parent:: para llamar a funciones de la clase abstracta. El modelo en cuestión se pasa al constructor (está definido en abstractEloquentRepository)

// registro del repositorio
class RepositoriesServiceProvider extends ServiceProvider
-> esto es necesario si tenemos interfaz para cada repositorio (beneficio?)

CONTROLADOR (ejemplo)

    public function update(Request $request, $id)
    {
        // Validation
        $validatorResponse = $this->validateRequest($request, $this->updateRequestValidationRules($request));

        // Send failed response if validation fails
        if ($validatorResponse !== true) {
            return $this->sendInvalidFieldResponse($validatorResponse);
        }

        $message = $this->messageRepository->findOne($id);

        if (!$message instanceof Message) {
            return $this->sendNotFoundResponse("The message with id {$id} doesn't exist");
        }

        // Authorization
        $this->authorize('update', $message);


        $message = $this->messageRepository->update($message, $request->all());

        return $this->respondWithItem($message, $this->messageTransformer);
    }





Fractal ("vista" para json): clase Transformer?

Oauth2 Authorization Code / Implicit / Password credentials
https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
https://stackoverflow.com/questions/16321455/what-is-the-difference-between-the-2-workflows-when-to-use-authorization-code-f


Passport

Let’s use composer to install the package

# Install lumen-passport
composer require dusterio/lumen-passport
After the package installation, we need to run these two commands below to create OAuth2 specific tables and oauth-private, oauth-public key.

# Create new tables for Passport
php artisan migrate

# Install encryption keys and other necessary stuff for Passport
php artisan passport:install
Then, We need to enable both Laravel Passport provider and Lumen-specific provider.

 //bootstrap/app.php

 $app->routeMiddleware([
     'auth' => App\Http\Middleware\Authenticate::class,
 ]);

$app->register(Laravel\Passport\PassportServiceProvider::class);
$app->register(Dusterio\LumenPassport\PassportServiceProvider::class);
$app->register(App\Providers\AuthServiceProvider::class);

OAuth2 Configuration
Lumen doesn’t come with config directory. Let’s create config directory and create auth.php file.

<?php //config/auth.php return [ 'defaults' => [
        'guard' => 'api',
        'passwords' => 'users',
    ],

    'guards' => [
        'api' => [
            'driver' => 'passport',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => \App\Models\User::class
        ]
    ]
];
User Model Change
Add HasApiTokens trait in User Model.

class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, SoftDeletes, HasApiTokens;

    /* rest of the model */
}
Defining Scopes
Scopes allow your API clients to request a specific set of permissions when requesting authorization to access an account. We can define API’s scopes using the Passport::tokensCan method in the boot method of AuthServiceProvider

      
    // app/Providers/AuthServiceProvider.php

        Passport::tokensCan([
            'admin' => 'Admin user scope',
            'basic' => 'Basic user scope',
        ]);
Protecting Routes
We’ve implemented OAuth2 authentication. But we haven’t used that in our route yet. Passport includes an authentication guard that will validate access tokens on incoming requests. Let’s refactor our users resource and add auth:api middleware.

//routes/web.php

$app->group(['middleware' => 'auth:api'], function () use ($app) {
    $app->post('users', 'UserController@store');
    $app->get('users', 'UserController@index');
    $app->get('users/{id}', 'UserController@show');
    $app->put('users/{id}', 'UserController@update');
    $app->delete('users/{id}', 'UserController@destroy');
});



CORS (protección extra: definimos que dominios pueden acceder a nuestra API)


