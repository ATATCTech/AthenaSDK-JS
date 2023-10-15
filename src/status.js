export default class Status {
    static equal(intStatus, stringStatus) {
        stringStatus = stringStatus.toUpperCase();
        if (intStatus >= 0 && intStatus <= 10)
            return stringStatus === "RESERVED";
        switch (intStatus) {
            case 11:
                return stringStatus === "SUCCESS";
            case 12:
                return stringStatus === "FAILED";
            case 13:
                return stringStatus === "UNDEFINED";
            case 14:
                return stringStatus === "KNOWN_ERROR";
            case 15:
                return stringStatus === "UNKNOWN_ERROR";
            case 16:
                return stringStatus === "UNAVAILABLE";
            case 17:
                return stringStatus === "BLOCKED";
            default:
                return stringStatus === "UNKNOWN";
        }
    }
    static success(intStatus) {
        return Status.equal(intStatus, "SUCCESS");
    }
    static failed(intStatus) {
        return Status.equal(intStatus, "FAILED");
    }
    static unavailable(intStatus) {
        return Status.equal(intStatus, "UNAVAILABLE");
    }
}
//# sourceMappingURL=status.js.map