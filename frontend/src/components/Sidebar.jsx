
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import {
    Users,
    PlusCircle,
    X,
    Search,
    Filter,
    Bell,
    CheckCircle2,
    XCircle,
    User2,
    UserPlus2Icon,
    MailPlus,
    Loader2,
    Clock,
    UserCheck,
    Loader,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import ModalSkeleton from "./skeletons/ModalSkeleton";
import { useAuthStore } from "../store/useAuthStore";

dayjs.extend(relativeTime);

// Mock data for testing
const MOCK_CONTACTS = [
    {
        _id: "c1",
        profilePic: "https://i.pravatar.cc/150?img=1",
        user: {
            _id: "u1",
            username: "Sarah Johnson",
            status: "online",
            lastMessage: "Hey, are you free to talk?",
            lastActive: "2 min ago"
        }
    },
    {
        _id: "c2",
        profilePic: "https://i.pravatar.cc/150?img=2",
        user: {
            _id: "u2",
            username: "Michael Chen",
            status: "offline",
            lastMessage: "Let's meet tomorrow",
            lastActive: "3 hours ago"
        }
    },
    {
        _id: "c3",
        profilePic: "https://i.pravatar.cc/150?img=3",
        user: {
            _id: "u3",
            username: "Alex Rodriguez",
            status: "online",
            lastMessage: "Thanks for the help!",
            lastActive: "Just now"
        }
    },
    {
        _id: "c4",
        profilePic: null,
        user: {
            _id: "u4",
            username: "Jordan Taylor",
            status: "offline",
            lastMessage: "Did you get my email?",
            lastActive: "1 day ago"
        }
    },
    {
        _id: "c5",
        profilePic: "https://i.pravatar.cc/150?img=5",
        user: {
            _id: "u5",
            username: "Morgan Williams with a very long name that should truncate",
            status: "online",
            lastMessage: "Can we discuss the project?",
            lastActive: "5 min ago"
        }
    },
    {
        _id: "c6",
        profilePic: "https://i.pravatar.cc/150?img=6",
        user: {
            _id: "u6",
            username: "Emily Davis",
            status: "online",
            lastMessage: "I sent you the files",
            lastActive: "10 min ago"
        }
    },
    {
        _id: "c7",
        profilePic: "https://i.pravatar.cc/150?img=7",
        user: {
            _id: "u7",
            username: "Daniel Martinez",
            status: "offline",
            lastMessage: "See you at the meeting",
            lastActive: "5 hours ago"
        }
    },
    {
        _id: "c8",
        profilePic: null,
        user: {
            _id: "u8",
            username: "Sophia Lee",
            status: "online",
            lastMessage: "How are you doing?",
            lastActive: "Just now"
        }
    },
    {
        _id: "c9",
        profilePic: "https://i.pravatar.cc/150?img=9",
        user: {
            _id: "u9",
            username: "James Anderson",
            status: "away",
            lastMessage: "I'll be back soon",
            lastActive: "30 min ago"
        }
    },
    {
        _id: "c10",
        profilePic: "https://i.pravatar.cc/150?img=10",
        user: {
            _id: "u10",
            username: "Chloe Kim",
            status: "offline",
            lastMessage: "Thanks for your help",
            lastActive: "2 days ago"
        }
    },
    {
        _id: "c11",
        profilePic: "https://i.pravatar.cc/150?img=11",
        user: {
            _id: "u11",
            username: "William Garcia",
            status: "online",
            lastMessage: "Let me know when you're free",
            lastActive: "15 min ago"
        }
    },
    {
        _id: "c12",
        profilePic: "https://i.pravatar.cc/150?img=12",
        user: {
            _id: "u12",
            username: "Ava Wilson",
            status: "busy",
            lastMessage: "In a meeting right now",
            lastActive: "1 hour ago"
        }
    },
    {
        _id: "c13",
        profilePic: null,
        user: {
            _id: "u13",
            username: "David Thomas",
            status: "offline",
            lastMessage: "Call me when you can",
            lastActive: "1 week ago"
        }
    },
    {
        _id: "c14",
        profilePic: "https://i.pravatar.cc/150?img=14",
        user: {
            _id: "u14",
            username: "Isabella Moore",
            status: "online",
            lastMessage: "Looking forward to seeing you",
            lastActive: "20 min ago"
        }
    },
    {
        _id: "c15",
        profilePic: "https://i.pravatar.cc/150?img=15",
        user: {
            _id: "u15",
            username: "Benjamin Jackson",
            status: "offline",
            lastMessage: "I'll check and get back to you",
            lastActive: "4 hours ago"
        }
    }
];

const MOCK_USERS = [
    // {
    //     _id: "68150253e883886f43e1f630",
    //     email: "bryansuguitan17@gmail.com",
    //     username: "bengbang17",
    //     profilePic: "https://res.cloudinary.com/deb0bujsu/image/upload/v1747098618/pymjyuilodbmtfnltj5q.jpg",
    //     isVerified: true,
    //     createdAt: "2025-05-02T17:35:15.854Z",
    //     updatedAt: "2025-05-17T21:26:53.265Z",
    //     lastLogin: "2025-05-17T21:26:53.265Z",
    //     __v: 0
    // },
    // {
    //     _id: "68150253e883886f43e1f631",
    //     email: "janedoe@example.com",
    //     username: "jane_doe",
    //     profilePic: "https://i.pravatar.cc/150?img=20",
    //     isVerified: true,
    //     createdAt: "2025-05-03T14:20:10.854Z",
    //     updatedAt: "2025-05-15T18:00:00.000Z",
    //     lastLogin: "2025-05-15T18:00:00.000Z",
    //     __v: 0
    // },
    // {
    //     _id: "68150253e883886f43e1f632",
    //     email: "johnsmith@example.com",
    //     username: "johnny_smith",
    //     profilePic: "https://i.pravatar.cc/150?img=21",
    //     isVerified: false,
    //     createdAt: "2025-04-28T11:00:00.000Z",
    //     updatedAt: "2025-05-12T09:00:00.000Z",
    //     lastLogin: "2025-05-12T09:00:00.000Z",
    //     __v: 0
    // },
    // {
    //     _id: "68150253e883886f43e1f633",
    //     email: "alicej@example.com",
    //     username: "alicej",
    //     profilePic: "https://i.pravatar.cc/150?img=22",
    //     isVerified: true,
    //     createdAt: "2025-05-01T08:15:30.854Z",
    //     updatedAt: "2025-05-17T10:45:00.000Z",
    //     lastLogin: "2025-05-17T10:45:00.000Z",
    //     __v: 0
    // },
    // {
    //     _id: "68150253e883886f43e1f634",
    //     email: "michael.lee@example.com",
    //     username: "mikelee",
    //     profilePic: "https://i.pravatar.cc/150?img=23",
    //     isVerified: false,
    //     createdAt: "2025-05-04T19:30:00.000Z",
    //     updatedAt: "2025-05-14T16:20:00.000Z",
    //     lastLogin: "2025-05-14T16:20:00.000Z",
    //     __v: 0
    // }
];

const MOCK_REQUESTS = [
    {
        _id: "682cdd848bd972c98dda0aab",
        createdAt: "2025-05-20T19:52:36.666Z",
        updatedAt: "2025-05-20T19:52:36.666Z",
        status: "pending",
        recipient: "68150253e883886f43e1f630",
        requester: {
            _id: "6819994942cebc37897f82f5",
            email: "bryanquicker@gmail.com",
            username: "bengbang",
            profilePic: ""
        },
        __v: 0
    },
    {
        _id: "682cdd848bd972c98dda0aac",
        createdAt: "2025-05-21T10:15:12.001Z",
        updatedAt: "2025-05-21T10:15:12.001Z",
        status: "accepted",
        recipient: "68150253e883886f43e1f631",
        requester: {
            _id: "6819994942cebc37897f82f6",
            email: "john@example.com",
            username: "johnnydev",
            profilePic: ""
        },
        __v: 0
    },
    {
        _id: "682cdd848bd972c98dda0aad",
        createdAt: "2025-05-22T08:45:00.333Z",
        updatedAt: "2025-05-22T08:45:00.333Z",
        status: "declined",
        recipient: "68150253e883886f43e1f632",
        requester: {
            _id: "6819994942cebc37897f82f7",
            email: "alice@example.com",
            username: "alicetech",
            profilePic: ""
        },
        __v: 0
    },
    {
        _id: "682cdd848bd972c98dda0aae",
        createdAt: "2025-05-23T14:30:20.789Z",
        updatedAt: "2025-05-23T14:30:20.789Z",
        status: "pending",
        recipient: "68150253e883886f43e1f633",
        requester: {
            _id: "6819994942cebc37897f82f8",
            email: "maria@example.com",
            username: "mariabuilds",
            profilePic: ""
        },
        __v: 0
    },
    {
        _id: "682cdd848bd972c98dda0aaf",
        createdAt: "2025-05-24T16:00:00.000Z",
        updatedAt: "2025-05-24T16:00:00.000Z",
        status: "accepted",
        recipient: "68150253e883886f43e1f634",
        requester: {
            _id: "6819994942cebc37897f82f9",
            email: "leo@example.com",
            username: "leocoder",
            profilePic: ""
        },
        __v: 0
    },
    {
        _id: "682cdd848bd972c98dda0aba",
        createdAt: "2025-05-25T09:10:45.123Z",
        updatedAt: "2025-05-25T09:10:45.123Z",
        status: "pending",
        recipient: "68150253e883886f43e1f635",
        requester: {
            _id: "6819994942cebc37897f82fa",
            email: "nina@example.com",
            username: "ninabyte",
            profilePic: ""
        },
        __v: 0
    }
];

const Sidebar = () => {
    const {
        getUserContacts,
        contacts: storeContacts,
        selectedUser,
        setSelectedUser,
        isUsersLoading,
        isContactsLoading,
        getAllUsers,
        users: allUsers,
        sendContactRequest,
        isSendingContactRequest,
        isGettingContactRequests,
        getContactRequests,
        contactRequests,
        acceptContactRequest,
        isAcceptingContact,
        declineContactRequest,
        isDecliningContact,
        inviteUser,
        isInvitingUser,
    } = useChatStore();

    const { onlineUsers } = useAuthStore();

    const [filterStatus, setFilterStatus] = useState("all"); // "all", "online", "offline"
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [useMockData, setUseMockData] = useState(false); // Set to false in production
    const [useMockUsers, setMockUsers] = useState(true); // Set to false in production
    const [useMockRequests, setMockRequests] = useState(false); // Set to false in production
    const [loadingRequestId, setLoadingRequestId] = useState(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [email, setEmail] = useState("");

    const contacts = useMockData ? MOCK_CONTACTS : storeContacts;
    const users = useMockUsers ? MOCK_USERS : allUsers.users;
    const contactRequestsList = useMockRequests ? MOCK_REQUESTS : contactRequests.requests;
    const [pendingRequestCount, setPendingRequestCount] = useState(contactRequestsList?.length || 0);

    // const isGettingContactRequests = true

    // Filter contacts based on status and search query
    const filteredContacts = contacts.filter(({ user }) => {
        if (!user) return false;

        const username = user.username?.toLowerCase() || "";
        const search = searchQuery.toLowerCase();

        const isOnline = onlineUsers.includes(user._id);

        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "online" && isOnline) ||
            (filterStatus === "offline" && !isOnline);

        const matchesSearch = username.includes(search);

        return matchesStatus && matchesSearch;
    });


    useEffect(() => {
        if (contactRequests) {
            console.log(contactRequests)
            console.log("Updated contactRequests:", contactRequestsList);
        }

        if (users) {
            console.log("Updated users: ", users)
        }
        console.log("Contacts:", contacts);
        console.log(`Selected contact: ${selectedUser}`)
    }, [contactRequests, users, selectedUser]);

    useEffect(() => {
        const currentRequests = useMockRequests ? MOCK_REQUESTS : contactRequests?.requests || [];

        const pendingCount = currentRequests.filter(req => req.status === "pending").length;
        setPendingRequestCount(pendingCount);
    }, [useMockRequests, contactRequests]);

    useEffect(() => {
        getContactRequests();
        getAllUsers();
        getUserContacts();
    }, [getUserContacts, useMockData, getAllUsers, getContactRequests, isSendingContactRequest, isDecliningContact, isAcceptingContact]);

    const toggleMockData = () => {
        setUseMockData(!useMockData);
        if (!useMockData) {
            getUserContacts();
        }
    };

    const toggleMockUsers = () => {
        setMockUsers(!useMockUsers);
        if (!useMockUsers) {
            getAllUsers();
        }
        console.log(users)
    };

    const toggleMockRequests = () => {
        setMockRequests(!useMockRequests);
        if (!useMockRequests) {
            getContactRequests();
        }
        console.log(contactRequests)
    };


    const handleRequestContact = (recipientId, user) => {
        sendContactRequest(recipientId)
        setShowModal(false)
        console.log(user)
    };

    const handleAcceptContactRequest = (requesterId) => {
        acceptContactRequest(requesterId)
        setLoadingRequestId(requesterId);
        setShowRequestsModal(false)
        console.log(requesterId)
    };

    const handleDeclineContactRequest = (requesterId) => {
        declineContactRequest(requesterId)
        setLoadingRequestId(requesterId);
        setShowRequestsModal(false)
        console.log(requesterId)
    };

    const handleInviteUser = async (email) => {
        const success = await inviteUser(email);
        if (success === true) {
            setShowInviteModal(false);
        }
        console.log(email)
    }


    if (!useMockData && (isContactsLoading)) {
        return <SidebarSkeleton />;
    }

    return (
        <>
            <aside className="h-full w-20 lg:w-80 border-r border-base-300 flex flex-col transition-all duration-200 shadow-sm">
                {/* Header */}
                <div className="border-b border-base-300 w-full p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="size-5" />
                            <span className="font-semibold hidden lg:block">Contacts</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowRequestsModal(true)}
                                className="relative p-1.5 rounded-full transition-colors hover:cursor-pointer"
                            >
                                <Bell className="size-5" />
                                {pendingRequestCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-error text-primary-content text-xs rounded-full size-5 flex items-center justify-center">
                                        {pendingRequestCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search and filter */}
                    <div className="mt-3 hidden lg:block">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input input-bordered input-sm w-full pl-10 pr-4 rounded-full bg-base-100 dark:bg-base-200 border-base-300 dark:border-base-700 focus:ring focus:ring-primary"
                            />
                        </div>


                        <div className="flex mt-3 gap-2">
                            <button
                                onClick={() => setFilterStatus("all")}
                                className={`btn btn-sm rounded-full flex-1 transition-colors ${filterStatus === "all" ? "btn-primary" : "btn-outline"
                                    }`}

                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterStatus("online")}
                                className={`btn btn-sm rounded-full flex-1 transition-colors ${filterStatus === "online" ? "btn-success" : "btn-outline"
                                    }`}
                            >
                                Online
                            </button>

                            <button
                                onClick={() => setFilterStatus("offline")}
                                className={`btn btn-sm rounded-full flex-1 transition-colors ${filterStatus === "offline" ? "btn-ghost" : "btn-outline"
                                    }`}
                            >
                                Offline
                            </button>

                        </div>
                    </div>
                    {/* Mobile filter button */}
                    <div className="mt-2 lg:hidden flex justify-center">
                        <button
                            onClick={() => setFilterStatus(filterStatus === "online" ? "all" : "online")}
                            className={`btn btn-circle btn-sm p-1.5 ${filterStatus === "online"
                                ? "bg-success text-success-content"
                                : "bg-base-200 text-base-content"
                                }`}
                            aria-label="Toggle Online Filter"
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Dev: Toggle test/mock data */}
                    {process.env.NODE_ENV !== "production" && (
                        <div className="mt-2 hidden lg:flex items-center gap-2">
                            <label className="cursor-pointer flex items-center gap-2 select-none">
                                <input
                                    type="checkbox"
                                    checked={useMockData}
                                    onChange={toggleMockData}
                                    className="checkbox checkbox-xs"
                                />
                                <span className="text-xs text-base-content/60">Use test data</span>
                            </label>
                        </div>
                    )}

                </div>

                {/* Contact list */}
                <div className="overflow-y-auto w-full py-2 flex-1 scrollbar-thin scrollbar-thumb-base-300 dark:scrollbar-thumb-base-content">
                    {filteredContacts.length > 0 ? (
                        <div className="space-y-1 px-1">
                            {filteredContacts.map((contact) => (
                                <button
                                    key={contact._id}
                                    onClick={() => setSelectedUser(contact?.user)}
                                    className={`
            w-full p-2 flex items-center gap-3 rounded-lg
            hover:bg-base-200 dark:hover:bg-base-700 transition-colors
            ${selectedUser?._id === contact._id ? "bg-base-200 dark:bg-base-700" : ""}
          `}
                                    aria-pressed={selectedUser?._id === contact._id}
                                >
                                    <div className="relative mx-auto lg:mx-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-base-200 dark:bg-base-700 flex items-center justify-center">
                                            {contact.profilePic ? (
                                                <img
                                                    src={contact.profilePic}
                                                    alt={contact.user.username}
                                                    className="w-12 h-12 object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 flex items-center justify-center bg-primary/20 text-primary dark:bg-primary/40 dark:text-primary-content">
                                                    <User2 className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        {onlineUsers.includes(contact.user._id) && (
                                            <span
                                                className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                                            />)}
                                    </div>

                                    <div className="hidden lg:block text-left min-w-0 flex-1">
                                        <div className="font-medium truncate text-base-content">
                                            {contact.user.username}
                                        </div>
                                        <div className="text-xs truncate text-base-content/60">
                                            {contact.user.lastMessage || 'No messages yet'}
                                        </div>
                                        <div className="text-xs text-base-content/50 mt-0.5">
                                            {contact.user.lastActive}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        !useMockData && !isContactsLoading && (
                            <div className="text-center py-8 px-3">
                                <div className="mx-auto bg-base-200 dark:bg-base-700 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                                    <Users className="w-8 h-8 text-base-content/60" />
                                </div>
                                <p className="text-sm font-medium text-base-content mb-1">
                                    {searchQuery ? "No matching contacts" : "No contacts found"}
                                </p>
                                <p className="text-xs text-base-content/50 mb-4">
                                    {filterStatus === "online"
                                        ? "No online contacts available."
                                        : searchQuery
                                            ? "Try a different search term"
                                            : "Add some friends to get started!"}
                                </p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="btn btn-sm btn-outline btn-primary rounded-full px-4 py-2 text-xs font-medium inline-flex items-center justify-center gap-1"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <div className="hidden lg:block">Add Contacts</div>
                                </button>
                            </div>
                        )

                    )}
                </div>

                {/* Add Contact and Invite Button */}
                <div className="mt-auto border-t border-base-300 py-3 flex justify-between md:px-2">
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-xs btn-primary rounded-lg px-2 text-xs font-small hover:opacity-90 flex items-center justify-center gap-1 py-2"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden lg:inline">Add</span>
                    </button>

                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="btn btn-xs btn-secondary rounded-lg px-2 text-xs font-small hover:opacity-90 flex items-center justify-center gap-1 py-2"
                    >
                        <MailPlus className="w-4 h-4" />
                        <span className="hidden lg:inline">Invite</span>
                    </button>
                </div>

            </aside>

            {/* Add Contact Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="contact-requests-title"
                >
                    <div
                        className="bg-base-100 dark:bg-base-900 p-6 rounded-xl shadow-lg w-[90%] max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-error p-1 transition-colors"
                            onClick={() => setShowModal(false)}
                            aria-label="Close contact requests modal"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Title */}
                        <h2 id="contact-requests-title" className="text-xl font-semibold mb-4 text-base-content">
                            Add Contact
                        </h2>

                        {(!useMockData && (isUsersLoading)) ? (
                            <ModalSkeleton />
                        ) : (
                            <>
                                {/* Dev: Toggle test/mock data */}
                                {process.env.NODE_ENV !== "production" && (
                                    <div className="mt-2 hidden lg:flex items-center gap-2">
                                        <label className="cursor-pointer flex items-center gap-2 select-none">
                                            <input
                                                type="checkbox"
                                                checked={useMockUsers}
                                                onChange={toggleMockUsers}
                                                className="checkbox checkbox-xs"
                                            />
                                            <span className="text-xs text-base-content/60">Use test data</span>
                                        </label>
                                    </div>
                                )}

                                {/* User List */}
                                {Array.isArray(users) && users.length > 0 ? (
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                        {users.map(user => (
                                            <div
                                                key={user._id}
                                                className="flex items-center gap-3 p-3 border border-base-300 dark:border-base-700 rounded-lg bg-base-200 dark:bg-base-800"
                                            >
                                                <div className="size-12 rounded-full overflow-hidden flex-shrink-0">
                                                    {user.profilePic ? (
                                                        <img src={user.profilePic} alt={user.username} className="size-12 object-cover" />
                                                    ) : (
                                                        <div className="size-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                                            <User2 className="size-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate text-base-content mb-2">
                                                        {user.username}
                                                    </div>
                                                    <div className="text-xs text-base-content/60 italic">
                                                        <span className="inline-block bg-base-300 dark:bg-base-700 px-2 py-0.5 rounded-full">
                                                            Joined {dayjs(user.createdAt).fromNow()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {user.contactRequest?.status === "accepted" ? (
                                                    // Connected
                                                    <div
                                                        className="p-1.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                                        title="Already connected"
                                                    >
                                                        <UserCheck className="size-4" />
                                                    </div>
                                                ) : user.contactRequest?.status === "pending" ? (
                                                    // Request pending
                                                    <div
                                                        className="p-1.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                                                        title="Request pending"
                                                    >
                                                        <Clock className="size-4" />
                                                    </div>
                                                ) : (
                                                    // No request yet, show add button
                                                    <button
                                                        className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-gray-500 dark:text-gray-100 dark:hover:bg-gray-800 transition-colors hover:cursor-pointer"
                                                        onClick={() => handleRequestContact(user._id, user)}
                                                        title="Add contact"
                                                    >
                                                        <UserPlus2Icon className="size-4" />
                                                    </button>
                                                )}

                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center pt-6">
                                        <p className="text-base-content/60">No Other Users</p>
                                        <button
                                            onClick={() => {
                                                setShowModal(false);
                                                setShowInviteModal(true);
                                            }}
                                            className="btn btn-small btn-secondary rounded-lg px-4 text-medium font-medium hover:opacity-90 items-center justify-center gap-1 py-2 mt-3"
                                        >
                                            <MailPlus className="w-4 h-4" />
                                            <span className="hidden lg:inline">Invite</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

            )}

            {/* Contact Requests Modal */}
            {showRequestsModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                    onClick={() => setShowRequestsModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="contact-requests-title"
                >
                    <div
                        className="bg-base-100 dark:bg-base-900 p-6 rounded-xl shadow-lg w-[90%] max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-error p-1 transition-colors"
                            onClick={() => setShowRequestsModal(false)}
                            aria-label="Close contact requests modal"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2
                            id="contact-requests-title"
                            className="text-xl font-semibold mb-4 text-base-content"
                        >
                            Contact Requests
                        </h2>

                        {(!useMockRequests && (isGettingContactRequests)) ? (
                            <ModalSkeleton />
                        ) : (
                            <>
                                {/* Dev: Toggle test/mock data */}
                                {process.env.NODE_ENV !== "production" && (
                                    <div className="mt-2 hidden lg:flex items-center gap-2">
                                        <label className="cursor-pointer flex items-center gap-2 select-none">
                                            <input
                                                type="checkbox"
                                                checked={useMockRequests}
                                                onChange={toggleMockRequests}
                                                className="checkbox checkbox-xs"
                                            />
                                            <span className="text-xs text-base-content/60">Use test data</span>
                                        </label>
                                    </div>
                                )}

                                {Array.isArray(contactRequestsList) && contactRequestsList.length > 0 ? (
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                        {contactRequestsList.map(request => (
                                            <div
                                                key={request._id}
                                                className="flex items-center gap-3 p-3 border border-base-300 dark:border-base-700 rounded-lg bg-base-200 dark:bg-base-800"
                                            >
                                                <div className="size-12 rounded-full overflow-hidden flex-shrink-0">
                                                    {request.requester.profilePic ? (
                                                        <img
                                                            src={request.requester.profilePic}
                                                            alt={request.requester.username}
                                                            className="size-12 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="size-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                                            <User2 className="size-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate text-base-content">
                                                        {request.requester.username}
                                                    </div>
                                                    <div className="text-xs text-base-content/50">
                                                        Requested {dayjs(request.createdAt).fromNow()}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    {(isAcceptingContact || isDecliningContact) && loadingRequestId === request.requester._id ? (
                                                        <Loader />
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors hover:cursor-pointer"
                                                                aria-label={`Accept request from ${request.requester.username}`}
                                                                onClick={() => handleAcceptContactRequest(request.requester._id)}
                                                            >
                                                                <CheckCircle2 className="size-5" />
                                                            </button>
                                                            <button
                                                                className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors hover:cursor-pointer"
                                                                aria-label={`Decline request from ${request.requester.username}`}
                                                                onClick={() => handleDeclineContactRequest(request.requester._id)}
                                                            >
                                                                <XCircle className="size-5" />
                                                            </button>
                                                        </>

                                                    )}

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-base-content/60">No pending requests</p>
                                    </div>
                                )}
                            </>
                        )}


                    </div>
                </div>
            )}

            {/* Invite Other Users Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowInviteModal(false)}
                >
                    <div className="bg-white dark:bg-base-100 p-6 rounded-xl shadow-xl w-[90%] max-w-md relative"
                        onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowInviteModal(false)}
                            className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
                        >
                            ✕
                        </button>

                        <h3 className="text-lg font-semibold mb-4">Invite a Friend</h3>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                console.log("Inviting:", email);
                            }}
                        >
                            <label className="label">
                                <span className="label-text">Email address</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="friend@example.com"
                                valu={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input input-bordered w-full my-4"
                            />

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                onClick={() => handleInviteUser(email)}
                            >
                                {isInvitingUser ? <Loader /> : "Send Invite"}
                            </button>
                        </form>
                    </div>
                </div>
            )}


        </>
    );
};

export default Sidebar;