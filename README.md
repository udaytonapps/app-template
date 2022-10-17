# Template Application

A foundation for creating a new learning application.

## Application Configuration

To create a learning app, you can simply Fork this repository, familiarize yourself with how the app works (especially by reviewing this README), and start making changes.

The essential [Tsugi](https://www.tsugi.org/) design remains, with an `index.php`, `register.php`, and `database.php` files at the root of the project. This `README.md` file is of course stored here, as well. You will need to run an Apache server with PHP and MySQL (such as through [MAMP](https://www.mamp.info/en/windows/) or [WAMP](https://www.wampserver.com/en/), etc.). If you are already running Tsugi, you don't need to do anything more for this app. If you aren't running Tsugi, you'll need to set it up - see the [docs](https://www.tsugi.org/#docs).

### Typical development workflow:

First, clone the repository into your Tsugi `mod` folder.

Second, update the path to the APIs in the `ui/src/utils/common/constants.ts` file to reflect the name of your repository.

```ts
// ui/src/utils/common/constants.ts

export const EnvConfig: Record<CraEnvironment, LtiSessionConfig> = {
  pre_build: {
    // Change this line to reflect your pre-build repo path
    apiUrl: "/learning-apps/mod/mod-template/api/index.php",
    // apiUrl: "/tsugi/mod/my-cool-app/api/index.php",
    sessionId: APP_INFO_OVERRIDES.sessionId || "",
  },
  local_build: {
    // Change this line to reflect your local repo path
    apiUrl: "/learning-apps/mod/mod-template/api/index.php",
    // apiUrl: "/tsugi/mod/my-cool-app/api/index.php",
    sessionId,
  },
  deployed_build: {
    // Change this line to reflect your deployed repo path
    apiUrl: "/mod/template/api/index.php",
    // apiUrl: "/mod/my-cool-app/api/index.php",
    sessionId,
  },
};
```


 Then, you can access the root directory from the command line and access the UI directory to run the [npm](https://www.npmjs.com/) scripts for [installing](https://docs.npmjs.com/cli/v8/commands/npm-install) and [starting](https://docs.npmjs.com/cli/v8/commands/npm-start) the UI app (which are listed in the package.json file).

```
cd ui
npm install
npm start
```

The UI application will run a local server on http://localhost:3000/.

At first, you may not see anything except an info icon that toggles the developer panel. During development, this will display helpful information about your app and Tsugi session.

In order for your app to work, you will need to copy a valid LTI Launch session ID into the `ui/src/utils/common/constants.ts` file's `APP_INFO_OVERRIDES.sessionId` variable. This is what the UI application will pass to the backend API for any requests. You can copy a sessionId from a local launch of the tool by viewing it in the Tsugi developer panel. To do that, you should build the tool for your local Tsugi instance by running the `npm run build` command from the `ui` directory. This will build the static HTML/CSS files.

From here, you can make updates to files within the ui/src directory and see your changes reflected in the browser on port 3000 (it will happen automatically, there is no need to refresh).

> **A note about common files**:
Most common elements should be in a common or other dedicated folder. These are services or pieces of functionality that would be common to any learning app (such as a core router, common service, common React components, helper/constants files, etc.). When an update or improvement to common functionality is made, it should be made to the template, and then merged into the learning app that requires the update. In that way, the template stays up to date going forward, and it would be simple to merge the latest template code into other learning apps that may benefit from the updates/changes.

---

## Backend APIs

### Application Design

#### **Background**

The backend was created as a server-side application that receives calls from the UI client, interacts with the DB, and returns data (if applicable to that particular API call).

It created with PHP, using a simple application router to pass incoming calls to api.php to a series or router files, which in turn call controllers, which in turn call data access objects (DAOs).

#### **Folder Structure**

API code is stored within the `{YOUR_APP}/api` directory. The `_router` folder and `index.php` file immediately within the `api` directory may not need to be updated (unless you are adding or removing references to an API, per your project needs). Most work that you do for a learning app will be within the sub-directories relating to the resource being accessed, such as `common`, `instructor`, and `learner`.

`{YOUR_APP}/api/{RESOURCE}/index.php`:

A simple file for consolidating references to other files for the related resource. This file should be required by `{YOUR_APP}/api/index.php` (thereby implicitly requiring what is already required in this file).

`{YOUR_APP}/api/{RESOURCE}/{RESOURCE}-routes.php`:

Holds a simple routing structure for the APIs. API calls will be routed here depending on the resource path and HTTP request type (GET, POST, PUT, PATCH, DELETE). These router functions should call the related controller methods to interact with the data. Do not put logic in these router functions, they are to be kept small and simple.

> Restricting Routes: you can restrict routes (such as making them Instructor-only) by adding a middleware function to the route to reject the call if the user is not an instructor (or whatever condition you may want to specify).

```typescript

// Example route restriction
Route::add($resource . '/something', restrict(function () {
    $res = InstructorCtr::doSomething();
    return Route::sendJson($res);
}), 'get');

/**
 * Restriction middleware that only allows the routing if the user is an instructor.
 * Call this before any route callback that should be restricted to instructor use.
 */
function restrict($next)
{
    global $USER;
    if ($USER->instructor) {
        return $next;
    } else {
        return function () {
            http_response_code(401);
            return Route::sendJson(array('error' => 'Unauthorized'));
        };
    }
};

```

`{YOUR_APP}/api/{RESOURCE}/{RESOURCE}-controller.php`:

Holds conditions for interacting with the DAO (data access object) and returning the data to the client UI. For small learning apps, it is fine to store business logic here. For a larger application, or for considerable amounts of logic, it is preferable to extract the logic into a service and store it in `{RESOURCE}-service.php`.

`{YOUR_APP}/api/{RESOURCE}/{RESOURCE}-dao.php`:

Holds methods for interacting with the database. These methods may be very specific or very reusable, depending on the need. However, these methods should be concerned only with interacting directly with the database and returning the data. Additional or complex logic should be stored in a service and referenced from the controller.

`{YOUR_APP}/api/{RESOURCE}/{RESOURCE}-service.php`

(if applicable): Holds methods comprised of complex logic or business rules. For many learning apps, this may not be necessary if the logic is simple enough to be stored in the controller.

---

## Frontend UI

### Application Design

#### **Background**

The frontend was created to be a client-side application that makes call to the backend APIs and receives any returned data (if applicable to that particular API call).

The application UI was initially generated with [Create React App](https://create-react-app.dev/) using [TypeScript](https://www.typescriptlang.org/) and [SCSS](https://sass-lang.com/). By running the build command, the UI code is transpiled to JavaScript and CSS (by way of Create React App) and made readable by a browser.

It is important to understand a bit of how [React](https://reactjs.org/) works before attempting to create a new learning app with this structure. In particular, `useEffect()` with `setState()` inside of it can easily lead to an infinite loop without the proper dependencies. When in doubt, [check the docs](https://reactjs.org/docs/hooks-effect.html).

#### **Folder Structure**

UI code is stored within the `{YOUR_APP}/ui` directory. Most files immediately within the `ui` directory will not need to be updated (unless you are customizing or extending common functionality). Most work that you do for a learning app will be within the sub-directories `components`, `utils`, and `views`.

`{YOUR_APP}/ui/components`:

Holds any components that could be reused across the application (forms, dialogs, tables, etc.)

`{YOUR_APP}/ui/utils`:

Holds any utility functionality, such as...

- `api-connector.ts` for communicating with the backend APIs.
- `constants.ts` for centralizing core configuration data or commonly reused strings.
- `context.ts` for storing an application-wide [context](https://reactjs.org/docs/context.html). This is a simple yet powerful way to share data across a React application. Currently there is a context for core app info that is set within App.tsx but can be retrieved anywhere it is provided.
- `helpers.ts` for common functions that are not state-dependent and may be reused across the application
- `types.ts` for specifying types and interfaces to enforce within the application

`{YOUR_APP}/ui/views`:

Holds any components that comprise an entire 'view' for the application, such as the Main, Instructor, and Learner views. Many applications might only have these two views, and these views will reference components from the components directory. **Components from the components directory should never reference these views.** However, views can reference other views. For instance, Main will commonly hold the Instructor and Learner views.

### External Libraries (node.js packages)

#### **External libraries on [NPM](https://www.npmjs.com/)**

Over a million libraries and tools are available from npm, a popular node.js package manager for JavaScript and TypeScript projects. If you decide to add a new package to a learning app, be sure to reivew the npm page and consider whether the package is well-supported and likely to be maintained in the future. The libraries listed below are all accessible from npm.

As an additional consideration, if we create functionality in the UI that could be extracted into its own npm package for use across multiple learning apps (or other developers for other uses), we can certainly do so.

#### **UX/UI and Styling**

General styling is done with [React MUI](https://mui.com/), a React component library based on [Material Design](https://material.io/design) for JavaScript and TypeScript. React MUI includes commonly used and well-styled React components, including tables, buttons, loading indicators, dialogs, form fields, etc. Wherever possible, deference should be given to the designs set by a common design standard (such as Material Design) or a component library such as React MUI to ensure consistency and professionalism in the look and feel of the application.

Example:

```tsx
return (
  <Box mb={2}>
    <FormLabel>
      <Typography fontWeight={"bold"}>Instructor Comment</Typography>
    </FormLabel>
  </Box>
);
```

#### **Form Validation**

Form validation can be done with default HTML attributes (pattern, required, disabled, etc.) for simple use-cases, or with [React Hook Form](https://react-hook-form.com/) when more complexity is required. React Hook Form makes it relatively easy to manage the state of the form values and errors (see the Tokens file SettingsDialog.tsx).

#### **HTTP Requests**

[Axios](https://axios-http.com/docs/intro) can be used to simplify http requests.

Common Example:

```typescript
import axios from "axios";

// Async/Await call
const asyncAwaitResponse = await axios.get(
  `${config.apiUrl}/info?PHPSESSID=${config.sessionId}`
);
console.log(asyncAwaitResponse.data);

// Same call, with Promise instead of Async/Await
axios
  .get(`${config.apiUrl}/info?PHPSESSID=${config.sessionId}`)
  .then((response) => {
    console.log(response.data);
  });

// {
//     "username": "Jane Instructor",
//     "isInstructor": true,
//     "contextId": "1",
//     "linkId": "3",
//     "sessionId": "1234567890ABC",
//     "darkMode": true,
//     "baseColor": "#6B5B95"
// }
```

#### **Date and Time Management**

Use [Luxon](https://moment.github.io/luxon/#/) for managing, comparing, and formatting dates. The date will come to the UI application as a string representation of the date, and that can be manipulated easily by using Luxon's DateTime methods. See the constants.ts variable: DB_DATE_TIME_FORMAT for the exact format returned by the DB.

Common Example:

```typescript
import { DateTime } from "luxon";

const dateString = "2022-07-12 09:40:42";
const luxonDateObject = DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss");
const nicelyFormattedDate = luxonDateObject.toLocaleString(
  DateTime.DATETIME_MED
);
console.log(nicelyFormattedDate); // Jul 14, 2022, 9:40 AM
```
