import { db } from "../config/firebaseConfig";
import {
    doc,
    getDoc,
    setDoc,
    arrayUnion,
    Timestamp,
} from "firebase/firestore";
import type { IMessage } from "../types/interfaces/IMessage";

interface FirebaseContact {
    name: string;
    type: number;
    avatar: string;
    addedAt: string;
}

/**
 * Lưu contact mới vào Firestore
 * @param currentUser - Username của user hiện tại
 * @param contact - Thông tin contact cần lưu
 */
export async function saveUserContact(
    currentUser: string,
    contact: IMessage
): Promise<void> {
    try {
        const userDocRef = doc(db, "user_contacts", currentUser);

        const contactData: FirebaseContact = {
            name: contact.name,
            type: contact.type || 0,
            avatar: contact.avatar,
            addedAt: new Date().toISOString(),
        };

        await setDoc(
            userDocRef,
            {
                username: currentUser,
                contacts: arrayUnion(contactData),
                updatedAt: Timestamp.now(),
            },
            { merge: true }
        );

        console.log(`Saved contact ${contact.name} to Firebase for ${currentUser}`);
    } catch (error) {
        console.error("Error saving contact to Firebase:", error);
        throw error;
    }
}

/**
 * Lấy danh sách contacts từ Firestore
 * @param currentUser - Username của user hiện tại
 * @returns Danh sách contacts
 */
export async function getUserContacts(
    currentUser: string
): Promise<IMessage[]> {
    try {
        const userDocRef = doc(db, "user_contacts", currentUser);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const contacts: FirebaseContact[] = data.contacts || [];

            // Convert Firebase contacts to IMessage format
            return contacts.map((contact) => ({
                name: contact.name,
                type: contact.type,
                avatar: contact.avatar,
                actionTime: contact.addedAt,
            }));
        }

        return [];
    } catch (error) {
        console.error("Error getting contacts from Firebase:", error);
        return [];
    }
}

/**
 * Merge danh sách từ backend với Firebase
 * Ưu tiên backend data, chỉ thêm từ Firebase nếu chưa có
 * @param backendUsers - Danh sách user từ backend
 * @param firebaseUsers - Danh sách user từ Firebase
 * @returns Danh sách đã merge
 */
export function mergeUserLists(
    backendUsers: IMessage[],
    firebaseUsers: IMessage[]
): IMessage[] {
    const merged = [...backendUsers];

    firebaseUsers.forEach((fbUser) => {
        const exists = merged.some(
            (u) => u.name === fbUser.name && u.type === fbUser.type
        );

        if (!exists) {
            merged.push(fbUser);
        }
    });

    return merged;
}
