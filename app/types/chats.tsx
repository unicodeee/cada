
export type MatchProfile = {
    avatar: string;
    name: string;
    latestMessage: string;
    createdAt: string;
    unread?: number;
};

export type MyProfile = {
    avatar: string | null;
    preferredName?: string | null;
};

export type SidebarProps = {
    matchProfiles: MatchProfile[];
    myProfile: MyProfile | null;
};