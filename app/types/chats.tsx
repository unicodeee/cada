
export type MatchProfile = {
    avatarUrl: string;
    name: string;
    latestMessage: string;
    createdAt: string;
    unread?: number;
};

export type MyProfile = {
    avatarUrl: string | null;
    preferredName?: string | null;
};

export type SidebarProps = {
    matchProfiles: MatchProfile[];
    myProfile: MyProfile | null;
};