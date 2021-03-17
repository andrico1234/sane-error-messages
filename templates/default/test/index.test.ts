import { ErrorMessages } from "../src";

describe("ErrorMessage", () => {
  it("should return the default message", () => {
    const errorMessages = new ErrorMessages();
    const message = errorMessages.getErrorMessage("400");

    expect(message).toBe("We had trouble processing your request");
  });

  it("should return a custom message", () => {
    const errorMessages = new ErrorMessages({ "400": "There was an error" });
    const message = errorMessages.getErrorMessage("400");

    expect(message).toBe("There was an error");
  });

  it("should return a custom message for a custom code", () => {
    const errorMessages = new ErrorMessages({
      "400_POST": "No post on sundays",
    });
    const message = errorMessages.getErrorMessage("400_POST");

    expect(message).toBe("No post on sundays");
  });

  it("should return the record of messages", () => {
    const errorMessages = new ErrorMessages();
    const message = errorMessages.messages["400"];

    expect(message).toBe("We had trouble processing your request");
  });

  it("should return the fallback message if code does not exist", () => {
    const errorMessages = new ErrorMessages();
    const message = errorMessages.getErrorMessage(
      "fake-code",
      "this is the fallback"
    );

    expect(message).toBe("this is the fallback");
  });
});
