export function extractErrorMessage(error) {
    return error.response?.data?.detail || "An error occurred. Please try again later.";
}
