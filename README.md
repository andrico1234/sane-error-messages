# Sane Error Messages

- [Sane Error Messages](#sane-error-messages)
  - [The current state of error messaging](#the-current-state-of-error-messaging)
  - [Why should we create sane error messaging?](#why-should-we-create-sane-error-messaging)
  - [Getting started](#getting-started)
    - [Setting up your error messages](#setting-up-your-error-messages)
    - [Consuming your error messages](#consuming-your-error-messages)
  - [Further Reading](#further-reading)
  - [FAQs](#faqs)
  - [Todo](#todo)

Gone are the days of useless generic error messaging. Keep your end-users happy with `sane-error-messages`.

![](https://public-images-and-stuff.s3.amazonaws.com/ykhg3yuzq8931.png)

If you're here, you're likely concerned with making your user-facing products as delightful as possible. Error messaging plays an important role in that. Having useful error messages can go a long way in making a frustrating scenario for an end-user as pleasant as possible.

If you want to jump straight in, you can head over to our [quickstart](#getting-started)

## The current state of error messaging

In a perfect world, the error message would be redundant, users would use anything you've built, without friction. But errors will happen, and your end-users will run into them. These errors can stem from:

- Failing validation
- Server-side failures
- Rate limiting
- Borked code
- Acts of god

And when things go wrong, often the client-facing error messaging takes shape in one of two ways:

- Generic errors with no meaningful information, e.g. `Something went wrong, please try again later`
- Hyper specific messages from the stack trace sent by the server, e.g. `Error 10x29183: line 26: error mapping Object -> Int32`

Neither are helpful for our end-users.

For our users, the generic error creates a feeling of helplessness and frustration. A user is prevented from completing an action, and have no way of knowing why it happened, and how (or if) they can resolve it. This can result in loss of end-user trust, loss of customer, or an angry review.

On the other hand, hyper-specific error messages are a leaky abstraction and shouldn't be seen by our end-user's eyes. 

For one, these kind of errors provide implementation information about our server-side logic. Is this a security concern? maybe? I'm no pen-tester.

Secondly, if we're in the business of crafting engaging user experiences, our error messages should feel human and be service-oriented.

## Why should we create sane error messaging?

**Developer Sanity**

Hunting bugs is hard, and scanning logs is tedious. Sometimes we're provided with context about why things failed, and other times we aren't. If an end-user reports a bug it's important they can present to us as much useful information as possible.

A report from a user that says:

`Hi, I was using the app sometime last night updating my profile and all of a sudden it stopped working. The error said something about a validation error, but I don't know what that means`

is much less useful than:

`Hi, I was using the app sometime last night updating my profile and all of a sudden it stopped working. The error said "We had trouble updating your details. Your address must be located within the EU" but I live in England`

This saves us time and cuts down on red herrings. A clear and specific error message may also help an end-user understand what they themselves have done wrong, and could help them fix their mistake.

**Organisation Sanity**

Managing your error messages in this way also yields benefits on an organisation level. For those working in larger companies, copy/messaging may be the responsibility of an entirely separate department. 

The fewer places needed to make changes, the better. Keeping all of your error messages in a single source makes it much easier for those owning copy to adhere to your company's brand guidelines.

**End-user Sanity**

We want our end-users to enjoy using our products.

We don't want them feeling helpless when presented with a generic message. 
We don't want them feeling intimidated when faced with a cryptic stack trace. 
We don't want them feeling frustrated when they're stopped dead in their tracks in the middle of a task.

**What makes a good error message?**

Taken from [Microcopy: A complete guide](https://www.microcopybook.com/). A useful error message should satisy these qualities:

- Explain clearly that there is a problem
- Explain what the problem is
- If possible, provide a solution so that the user can complete the process, or
- Point them to where they can go for help
- Make a frustrating scenario as pleasant as possible

**How does Sane Error Messages help me?**

Inspired by how tools like [Cypress](https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/errors.js) handle their error messaging, `sane-error-messages` is designed to help you, the developer, easily manage your error messaging across your end-user facing products.

`sane-error-messages` creates a brand new repo for you, that you can customise to return sane error messages based on predefined error codes. You can then publish and consume from within your own projects.

As long as your server returns predictable error codes, the server-side implementation doesn't matter. This sequence is just one way of implementing `sane-error-messages`:

![](https://public-images-and-stuff.s3.amazonaws.com/Screenshot+2021-03-15+at+21.41.28.png)

## Getting started

### Setting up your error messages

Begin by running

`yarn global add sane-error-message` and
`sane-error-messages create <dirName>` to scaffold your project. Doing so will create a brand new module for you to customise with your default error messages. Your new module uses `tsdx` under-the-hood to handle all of the module management scripts, such as running, building, testing. 

You can learn more about [tsdx here](https://tsdx.io/)

Your project's default api will look like this:

```typescript
/* Define each code like so */
const USER_NOT_ADMIN = '403_USER_NOT_ADMIN'

/* Map each code to a default message */
private const errorCodes {
  // your codes and messages go here...
  '[USER_NOT_ADMIN]': "We're afraid only administrators have access to "
}

//The class used to initialise the error messages object in your project
class ErrorMessages {
  // You can override default messages with more specific ones
  constructor: (customErrorMessages: Partial<Record<string | number, string>>): ErrorMessages;

  // Pass through an error code to get your custom message
  getErrorMessage: (code: string | number, fallbackMessage?: string): string;

  // Checks to see if the argument is a valid error code and acts as a guard for non-ErrorCode values
  isErrorCode(code: string | number): boolean;

	// Returns the errorCodes object with your custom messages
  messages: Record<ErrorCode, string>
}

type ErrorCode = ValueOf<errorCodes>

```

### Consuming your error messages

If you created a repo with the name of `custom-error-messages` and published it to npm, you'd be able to consume it within your apps by doing the following:

```typescript
import { ErrorMessages } from 'custom-error-messages';

const customErrorMessages = {
  '400_validation': 'Please enter the fields in your form correctly',
};

// Initialise your errorMessages object with your custom messages
const errorMessages = new ErrorMessages(customErrorMessages);

// When this runs, the server will return an error
// When we catch this error, we get our message via the error code
// The message is then displayed on the clientside
function riskyFunction() {
  try {
    await boom();
  } catch (err) {
    const { code } = err;
    const message = errorMessages.getErrorMessage(code);
    displayNotification(message);
  }
}

```

If you want to mess around with the `sane-error-messages` straight away, you can see it in action with [this code sandbox](https://codesandbox.io/s/amazing-platform-dxtjc?file=/src/App.js)

## Further Reading
**Microcopy: A Complete Guide**
I mentioned this book a little earlier, and it's one of my favourites when it comes to making my user-facing products a lot more personable. You can find a link to it [here](www.microcopybook.com):

The book's author Kinneret, has graciously provided a coupon for 10% off.

Coupon code for the eBook: andrico-ebook
Coupon code for the bundle: andrico-bundle


## FAQs

**Why can't the server-side just return these messages?**

The server shouldn't be concerned with any client-facing logic, but if you're fortunate enough to work with an API that gives useful error codes with each failed request, then you're nearly there.

**Will I need to create an instance of error-messages for every API consumer?**

No necessarily. Because this package can take a list of default messages and codes, as long as it's in sync with the APIs, your frontends will be able to consume the same package. In each client-side instance, you can pass through additional error codes, or override existing messages to tailor your frontend messaging.

**I think this package should have X or do Y differently**

I'm dogfooding this internally at my job, and this is a problem space I'm very new to. I would love to hear of any suggestions, or improvements to the overall architecture or feature-set of `sane-error-messages`.

## Todo

- [ ] Script can be run via `npx` 
- [x] Get a repo set up 
- [x] Run a script that generates a new project for someone
- [x] Add instructions into a README
- [x] Use `tsdx` to handle all package management

Nice to have

- [ ] Link to error code object from remote
  - Would this be done at build time or run time?
- [ ] Clean up the exports, and reduce code repetition
- [ ] Create a javascript template