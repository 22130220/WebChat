import { db } from "../config/firebaseConfig";
import {
    doc,
    getDoc,
    setDoc,
    Timestamp,
} from "firebase/firestore";
import type { IUserProfile } from "../types/interfaces/IUserProfile";

/**
 * Lấy thông tin profile của user từ Firestore
 * @param username - Username của user
 * @returns User profile hoặc null nếu chưa có
 */
export async function getUserProfile(
    username: string
): Promise<IUserProfile | null> {
    try {
        const profileDocRef = doc(db, "user_profiles", username);
        const docSnap = await getDoc(profileDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                username: data.username,
                avatar: data.avatar || "",
                coverPhoto: data.coverPhoto || "",
                dateOfBirth: data.dateOfBirth || "",
                phoneNumber: data.phoneNumber || "",
                gender: data.gender || "Nam",
                updatedAt: data.updatedAt?.toDate().toISOString(),
            };
        }

        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
}

/**
 * Cập nhật thông tin profile của user
 * @param username - Username của user
 * @param profileData - Dữ liệu profile cần cập nhật
 */
export async function updateUserProfile(
    username: string,
    profileData: Partial<IUserProfile>
): Promise<void> {
    try {
        const profileDocRef = doc(db, "user_profiles", username);

        await setDoc(
            profileDocRef,
            {
                username,
                ...profileData,
                updatedAt: Timestamp.now(),
            },
            { merge: true }
        );

        console.log(`Updated profile for ${username}`);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

/**
 * Tạo profile mặc định cho user mới
 * @param username - Username của user
 */
export async function createDefaultProfile(
    username: string
): Promise<IUserProfile> {
    const defaultProfile: IUserProfile = {
        username,
        avatar: "",
        coverPhoto: "",
        dateOfBirth: "",
        phoneNumber: "",
        gender: "Nam",
    };

    await updateUserProfile(username, defaultProfile);
    return defaultProfile;
}

/**
 * Lấy avatars của nhiều users cùng lúc
 * @param usernames - Danh sách usernames
 * @returns Map từ username -> avatar URL (hoặc empty string nếu chưa có)
 */
export async function getUserAvatars(
    usernames: string[]
): Promise<Map<string, string>> {
    const avatarMap = new Map<string, string>();

    try {
        // Fetch tất cả profiles song song
        const promises = usernames.map(async (username) => {
            try {
                const profileDocRef = doc(db, "user_profiles", username);
                const docSnap = await getDoc(profileDocRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    return { username, avatar: data.avatar || "" };
                }
                return { username, avatar: "" };
            } catch (error) {
                console.error(`Error fetching avatar for ${username}:`, error);
                return { username, avatar: "" };
            }
        });

        const results = await Promise.all(promises);
        results.forEach(({ username, avatar }) => {
            avatarMap.set(username, avatar);
        });

        return avatarMap;
    } catch (error) {
        console.error("Error getting user avatars:", error);
        return avatarMap;
    }
}
