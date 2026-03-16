export interface LiveStreamInfo {
  videoId: string;
  title: string;
  embedUrl: string;
}

// Internal types for ytInitialData object

export interface YtTextRun {
  text: string;
}

export interface YtFormattedText {
  runs?: YtTextRun[];
  simpleText?: string;
}

export interface YtThumbnailOverlay {
  thumbnailOverlayTimeStatusRenderer?: {
    style?: string;
  };
}

export interface YtBadge {
  metadataBadgeRenderer?: {
    style?: string;
  };
}

export interface YtVideoRenderer {
  videoId: string;
  title?: YtFormattedText;
  viewCountText?: YtFormattedText;
  thumbnailOverlays?: YtThumbnailOverlay[];
  badges?: YtBadge[];
  upcomingEventData?: unknown;
}

export interface YtInitialData {
  contents?: {
    twoColumnBrowseResultsRenderer?: {
      tabs?: Array<{
        tabRenderer?: {
          content?: {
            richGridRenderer?: {
              contents?: Array<{
                richItemRenderer?: {
                  content?: {
                    videoRenderer?: YtVideoRenderer;
                  };
                };
              }>;
            };
            sectionListRenderer?: {
              contents?: Array<{
                itemSectionRenderer?: {
                  contents?: Array<{
                    channelFeaturedContentRenderer?: {
                      items?: Array<{
                        videoRenderer?: YtVideoRenderer;
                      }>;
                    };
                    shelfRenderer?: {
                      content?: {
                        horizontalListRenderer?: {
                          items?: Array<{
                            gridVideoRenderer?: YtVideoRenderer;
                          }>;
                        };
                        expandedShelfContentsRenderer?: {
                          items?: Array<{
                            videoRenderer?: YtVideoRenderer;
                          }>;
                        };
                      };
                    };
                  }>;
                };
              }>;
            };
          };
        };
      }>;
    };
  };
}
