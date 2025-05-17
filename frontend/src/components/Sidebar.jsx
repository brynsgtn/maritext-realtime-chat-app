// import { useEffect, useState } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore"
// import SidebarSkeleton from "../skeletons/SidebarSkeleton";
// import { Users, PlusCircle, X } from "lucide-react";
// import { Link } from "react-router-dom";

// // Mock data for testing
// const MOCK_CONTACTS = [
//     {
//         _id: "c1",
//         profilePic: "https://i.pravatar.cc/150?img=1",
//         user: {
//             _id: "u1",
//             username: "Sarah Johnson",
//             status: "online"
//         }
//     },
//     {
//         _id: "c2",
//         profilePic: "https://i.pravatar.cc/150?img=2",
//         user: {
//             _id: "u2",
//             username: "Michael Chen",
//             status: "offline"
//         }
//     },
//     {
//         _id: "c3",
//         profilePic: "https://i.pravatar.cc/150?img=3",
//         user: {
//             _id: "u3",
//             username: "Alex Rodriguez",
//             status: "online"
//         }
//     },
//     {
//         _id: "c4",
//         profilePic: null,
//         user: {
//             _id: "u4",
//             username: "Jordan Taylor",
//             status: "offline"
//         }
//     },
//     {
//         _id: "c5",
//         profilePic: "https://i.pravatar.cc/150?img=5",
//         user: {
//             _id: "u5",
//             username: "Morgan Williams with a very long name that should truncate",
//             status: "online"
//         }
//     },
//     {
//         _id: "c6",
//         profilePic: "https://i.pravatar.cc/150?img=6",
//         user: {
//             _id: "u6",
//             username: "Emily Davis",
//             status: "online"
//         }
//     },
//     {
//         _id: "c7",
//         profilePic: "https://i.pravatar.cc/150?img=7",
//         user: {
//             _id: "u7",
//             username: "Daniel Martinez",
//             status: "offline"
//         }
//     },
//     {
//         _id: "c8",
//         profilePic: null,
//         user: {
//             _id: "u8",
//             username: "Sophia Lee",
//             status: "online"
//         }
//     },
//     {
//         _id: "c9",
//         profilePic: "https://i.pravatar.cc/150?img=9",
//         user: {
//             _id: "u9",
//             username: "James Anderson",
//             status: "away"
//         }
//     },
//     {
//         _id: "c10",
//         profilePic: "https://i.pravatar.cc/150?img=10",
//         user: {
//             _id: "u10",
//             username: "Chloe Kim",
//             status: "offline"
//         }
//     },
//     {
//         _id: "c11",
//         profilePic: "https://i.pravatar.cc/150?img=11",
//         user: {
//             _id: "u11",
//             username: "William Garcia",
//             status: "online"
//         }
//     },
//     {
//         _id: "c12",
//         profilePic: "https://i.pravatar.cc/150?img=12",
//         user: {
//             _id: "u12",
//             username: "Ava Wilson",
//             status: "busy"
//         }
//     },
//     {
//         _id: "c13",
//         profilePic: null,
//         user: {
//             _id: "u13",
//             username: "David Thomas",
//             status: "offline"
//         }
//     },
//     {
//         _id: "c14",
//         profilePic: "https://i.pravatar.cc/150?img=14",
//         user: {
//             _id: "u14",
//             username: "Isabella Moore",
//             status: "online"
//         }
//     },
//     {
//         _id: "c15",
//         profilePic: "https://i.pravatar.cc/150?img=15",
//         user: {
//             _id: "u15",
//             username: "Benjamin Jackson",
//             status: "offline"
//         }
//     }
// ];



// const Sidebar = () => {
//     const {
//         getUserContacts,
//         contacts: storeContacts,
//         selectedUser,
//         setSelectedUser,
//         isUsersLoading
//     } = useChatStore();

//     const [showOnlineOnly, setShowOnlineOnly] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [useMockData, setUseMockData] = useState(true); // Set to false in production
//     const [showRequests, setShowRequests] = useState(false);

//     const contacts = useMockData
//         ? MOCK_CONTACTS
//         : storeContacts;

//     const filteredContacts = showOnlineOnly
//         ? contacts.filter((c) => c.user.status === "online")
//         : contacts;

//     useEffect(() => {
//         if (!useMockData) {
//             getUserContacts();
//         }
//     }, [getUserContacts, useMockData]);

//     const toggleMockData = () => {
//         setUseMockData(!useMockData);
//         if (!useMockData) {
//             getUserContacts();
//         }
//     };

//     if (isUsersLoading && !useMockData) return <SidebarSkeleton />;

//     return (
//         <>
//             <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
//                 <div className="border-b border-base-300 w-full p-5">
//                     <div className="flex items-center gap-2">
//                         <Users className="size-6" />
//                         <span className="font-medium hidden lg:block">Contacts</span>
//                     </div>

//                     {/* Dev: Toggle test/mock data */}
//                     {process.env.NODE_ENV !== "production" && (
//                         <div className="mt-2 hidden lg:flex items-center gap-2">
//                             <label className="cursor-pointer flex items-center gap-2">
//                                 <input
//                                     type="checkbox"
//                                     checked={useMockData}
//                                     onChange={toggleMockData}
//                                     className="checkbox checkbox-xs"
//                                 />
//                                 <span className="text-xs text-zinc-500">Use test data</span>
//                             </label>
//                         </div>
//                     )}
//                 </div>

//                 <div className="overflow-y-auto w-full py-3">
//                     {filteredContacts.length > 0 ? (
//                         filteredContacts.map((contact) => (
//                             <button
//                                 key={contact._id}
//                                 onClick={() => setSelectedUser(contact)}
//                                 className={`
//                   w-full p-3 flex items-center gap-3
//                   hover:bg-base-300 transition-colors
//                   ${selectedUser?._id === contact._id
//                                         ? "bg-base-300 ring-1 ring-base-300"
//                                         : ""
//                                     }
//                 `}
//                             >
//                                 <div className="relative mx-auto lg:mx-0">
//                                     <img
//                                         src={contact.profilePic || "/avatar.png"}
//                                         alt={contact.user.username}
//                                         className="size-12 object-cover rounded-full"
//                                     />
//                                     {contact.user.status === "online" && (
//                                         <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-300" />
//                                     )}
//                                 </div>

//                                 <div className="hidden lg:block text-left min-w-0 flex-1">
//                                     <div className="font-medium truncate">
//                                         {contact.user.username}
//                                     </div>
//                                     <div className="text-xs text-zinc-400">
//                                         {contact.user.status}
//                                     </div>
//                                 </div>
//                             </button>
//                         ))
//                     ) : (
//                         <div className="text-center py-4 px-3">
//                             <p className="text-sm text-gray-500 mb-2">
//                                 {showOnlineOnly
//                                     ? "No online contacts available."
//                                     : "No contacts found."}
//                             </p>
//                             <button
//                                 onClick={() => setShowModal(true)}
//                                 className="btn btn-sm btn-outline btn-primary rounded-full px-3 text-xs font-medium"
//                             >
//                                 <PlusCircle className="size-4 lg:mr-1" />
//                                 <span className="hidden lg:inline">Add Contacts</span>
//                             </button>
//           <button
//             onClick={() => setShowRequests(true)}
//             className="btn btn-sm btn-outline btn-primary rounded-full px-3 text-xs font-medium"
//           >
//             <Users className="size-4 lg:mr-1" />
//             <span className="hidden lg:inline">View Requests</span>
//           </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Add Contact Button at Bottom */}
//                 <div className="mt-auto border-t border-base-300 p-4 text-center">
//                     <button
//                         onClick={() => setShowModal(true)}
//                         className="btn btn-sm btn-outline btn-primary rounded-full px-3 text-xs font-medium hover:text-white w-full lg:w-auto"
//                     >
//                         <PlusCircle className="size-4 lg:mr-1" />
//                         <span className="hidden lg:inline">Add Contacts</span>
//                     </button>
//                 </div>
//             </aside>

//             {/* Modal */}
//             {showModal && (
//                 <div
//                     className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
//                     onClick={() => setShowModal(false)}
//                 >
//                     <div
//                         className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <button
//                             className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
//                             onClick={() => setShowModal(false)}
//                         >
//                             <X className="w-5 h-5" />
//                         </button>
//                         <h2 className="text-lg font-semibold mb-4">Add New Contact</h2>
//                         <p className="text-sm text-gray-600">
//                             This is where your add contact form or content goes.
//                         </p>
//                     </div>
//                 </div>
//             )}


//             {/* Contact Requests Modal */}
//             {showRequests && (
//                 <div
//                     className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
//                     onClick={() => setShowRequests(false)}
//                 >
//                     <div
//                         className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <button
//                             className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
//                             onClick={() => setShowRequests(false)}
//                         >
//                             <X className="w-5 h-5" />
//                         </button>
//                         <h2 className="text-lg font-semibold mb-4">Contact Requests</h2>

//                         <div className="space-y-3">
//                             {/* Dummy contact request */}
//                             <div className="flex justify-between items-center p-2 border rounded dark:border-gray-600">
//                                 <span className="text-sm">Jane Doe wants to connect</span>
//                                 <div className="flex gap-1">
//                                     <button className="btn btn-xs btn-success">Accept</button>
//                                     <button className="btn btn-xs btn-error">Decline</button>
//                                 </div>
//                             </div>

//                             <div className="flex justify-between items-center p-2 border rounded dark:border-gray-600">
//                                 <span className="text-sm">John Smith sent a request</span>
//                                 <div className="flex gap-1">
//                                     <button className="btn btn-xs btn-success">Accept</button>
//                                     <button className="btn btn-xs btn-error">Decline</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default Sidebar;


// todo: add contact modal, view request modal, chat container


import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import {
    Users,
    PlusCircle,
    X,
    Search,
    Filter,
    Bell,
    CheckCircle2,
    XCircle,
    User2
} from "lucide-react";
import { Link } from "react-router-dom";

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

// Example contact requests
const MOCK_REQUESTS = [
    {
        _id: "r1",
        profilePic: "https://i.pravatar.cc/150?img=20",
        username: "Jane Doe",
        mutualConnections: 3,
        requestDate: "2 days ago"
    },
    {
        _id: "r2",
        profilePic: "https://i.pravatar.cc/150?img=21",
        username: "John Smith",
        mutualConnections: 1,
        requestDate: "5 hours ago"
    },
    {
        _id: "r3",
        profilePic: null,
        username: "Anna Williams",
        mutualConnections: 5,
        requestDate: "Just now"
    }
];

const StatusBadge = ({ status }) => {
    const statusColors = {
        online: "bg-green-500",
        offline: "bg-gray-400",
        away: "bg-yellow-500",
        busy: "bg-red-500"
    };

    return (
        <span className={`absolute bottom-0 right-0 size-3 ${statusColors[status] || "bg-gray-400"} rounded-full ring-2 ring-base-300`} />
    );
};

const Sidebar = () => {
    const {
        getUserContacts,
        contacts: storeContacts,
        selectedUser,
        setSelectedUser,
        isUsersLoading
    } = useChatStore();

    const [filterStatus, setFilterStatus] = useState("all"); // "all", "online", "offline"
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [useMockData, setUseMockData] = useState(true); // Set to false in production
    const [pendingRequestCount, setPendingRequestCount] = useState(MOCK_REQUESTS.length);

    const contacts = useMockData ? MOCK_CONTACTS : storeContacts;

    // Filter contacts based on status and search query
    const filteredContacts = contacts.filter((contact) => {
        const matchesStatus =
            filterStatus === "all" ||
            contact.user.status === filterStatus;

        const matchesSearch =
            contact.user.username.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    useEffect(() => {
        if (!useMockData) {
            getUserContacts();
        }
    }, [getUserContacts, useMockData]);

    const toggleMockData = () => {
        setUseMockData(!useMockData);
        if (!useMockData) {
            getUserContacts();
        }
    };

    if (isUsersLoading && !useMockData) return <SidebarSkeleton />;

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
                                className="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Bell className="size-5 text-gray-600 dark:text-gray-400" />
                                {pendingRequestCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-primary text-xs rounded-full size-5 flex items-center justify-center">
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
                                    onClick={() => setSelectedUser(contact)}
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
                                        <StatusBadge status={contact.user.status} />
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
                                Add Contacts
                            </button>
                        </div>
                    )}
                </div>

                {/* Add Contact Button at Bottom */}
                <div className="mt-auto border-t border-base-300 p-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-sm btn-primary rounded-lg px-3 text-xs font-medium hover:opacity-90 w-full flex items-center justify-center gap-2 py-2"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden lg:inline">Add New Contact</span>
                    </button>
                </div>

            </aside>

            {/* Add Contact Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                    onClick={() => setShowModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="add-contact-title"
                >
                    <div
                        className="bg-base-100 dark:bg-base-900 p-6 rounded-xl shadow-lg w-[90%] max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-error p-1 transition-colors"
                            onClick={() => setShowModal(false)}
                            aria-label="Close add contact modal"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2
                            id="add-contact-title"
                            className="text-xl font-semibold mb-4 text-base-content"
                        >
                            Add New Contact
                        </h2>

                        <form className="space-y-4">
                            <div>
                                <label
                                    htmlFor="contact-username"
                                    className="block text-sm font-medium text-base-content/80 mb-1"
                                >
                                    Username or Email
                                </label>
                                <input
                                    id="contact-username"
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-base-300 dark:border-base-700 bg-base-100 dark:bg-base-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                    placeholder="Enter username or email"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-message"
                                    className="block text-sm font-medium text-base-content/80 mb-1"
                                >
                                    Message (optional)
                                </label>
                                <textarea
                                    id="contact-message"
                                    className="w-full px-4 py-2 rounded-lg border border-base-300 dark:border-base-700 bg-base-100 dark:bg-base-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                                    placeholder="Add a message to your request"
                                    rows={3}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full btn btn-primary rounded-lg text-white font-medium transition-colors"
                                >
                                    Send Request
                                </button>
                            </div>
                        </form>
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

                        {MOCK_REQUESTS.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                {MOCK_REQUESTS.map(request => (
                                    <div
                                        key={request._id}
                                        className="flex items-center gap-3 p-3 border border-base-300 dark:border-base-700 rounded-lg bg-base-200 dark:bg-base-800"
                                    >
                                        <div className="size-12 rounded-full overflow-hidden flex-shrink-0">
                                            {request.profilePic ? (
                                                <img
                                                    src={request.profilePic}
                                                    alt={request.username}
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
                                                {request.username}
                                            </div>
                                            <div className="text-xs text-base-content/70">
                                                {request.mutualConnections} mutual connection{request.mutualConnections !== 1 ? 's' : ''}
                                            </div>
                                            <div className="text-xs text-base-content/50">
                                                Requested {request.requestDate}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <button
                                                className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors"
                                                aria-label={`Accept request from ${request.username}`}
                                            >
                                                <CheckCircle2 className="size-5" />
                                            </button>
                                            <button
                                                className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                                                aria-label={`Decline request from ${request.username}`}
                                            >
                                                <XCircle className="size-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-base-content/60">No pending requests</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    );
};

export default Sidebar;