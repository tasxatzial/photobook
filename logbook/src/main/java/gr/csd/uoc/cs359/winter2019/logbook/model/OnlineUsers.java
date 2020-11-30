package gr.csd.uoc.cs359.winter2019.logbook.model;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Stores the users that have been online the past minute
 */
public final class OnlineUsers {
    private static final Map<String, Date> users = createMap();

    private OnlineUsers() {}

    private static Map<String, Date> createMap() {
        return new HashMap<>();
    }

    /**
     * Adds the specified user to the online users.
     *
     * Use the isUserOnline() to check whether this user is still online.
     * @param username
     */
    public static void addUser(String username) {
        if (username != null) {
            users.put(username, new Date());
        }
    }

    /**
     * Removes the specified user from the online users.
     *
     * isUserOnline() should report false when this function returns.
     * @param username
     */
    public static void removeUser(String username) {
        if (username != null) {
            users.remove(username);
        }
    }

    /**
     * Checks whether the specified user is online.
     *
     * Will return true if this function is called less than 1 minute after the
     * user has been added to online users.
     *
     * @param username
     * @return
     */
    public static boolean isUserOnline(String username) {
        if (username == null) {
            return false;
        }

        Date userLastOnline = users.get(username);
        if (userLastOnline == null) {
            return false;
        } else {
            long now = new Date().getTime();
            return (now - userLastOnline.getTime() < 60000);
        }
    }
}
