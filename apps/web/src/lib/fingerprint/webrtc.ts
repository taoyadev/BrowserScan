/**
 * WebRTC IP Leak Detection
 * Uses STUN servers to discover local and public IPs via WebRTC
 */

const STUN_SERVERS = [
  'stun:stun.l.google.com:19302',
  'stun:stun1.l.google.com:19302',
  'stun:stun.cloudflare.com:3478'
];

export async function getWebRTCIPs(): Promise<string[]> {
  return new Promise((resolve) => {
    const ips = new Set<string>();
    const timeout = setTimeout(() => {
      resolve(Array.from(ips));
    }, 3000); // 3 second timeout

    try {
      const RTCPeerConnection =
        window.RTCPeerConnection ||
        (window as Window & { webkitRTCPeerConnection?: typeof RTCPeerConnection }).webkitRTCPeerConnection ||
        (window as Window & { mozRTCPeerConnection?: typeof RTCPeerConnection }).mozRTCPeerConnection;

      if (!RTCPeerConnection) {
        clearTimeout(timeout);
        resolve([]);
        return;
      }

      const pc = new RTCPeerConnection({
        iceServers: STUN_SERVERS.map(url => ({ urls: url }))
      });

      // Create data channel to trigger ICE gathering
      pc.createDataChannel('');

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          // ICE gathering complete
          clearTimeout(timeout);
          pc.close();
          resolve(Array.from(ips));
          return;
        }

        const candidate = event.candidate.candidate;
        const ipMatch = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);

        if (ipMatch) {
          const ip = ipMatch[0];
          ips.add(ip);
        }

        // Also check for IPv6
        const ipv6Match = candidate.match(/([a-f0-9]{1,4}:){7}[a-f0-9]{1,4}/i);
        if (ipv6Match) {
          ips.add(ipv6Match[0]);
        }
      };

      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete') {
          clearTimeout(timeout);
          pc.close();
          resolve(Array.from(ips));
        }
      };

      // Create offer to start ICE gathering
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(() => {
          clearTimeout(timeout);
          pc.close();
          resolve(Array.from(ips));
        });
    } catch (error) {
      console.error('WebRTC detection error:', error);
      clearTimeout(timeout);
      resolve([]);
    }
  });
}

/**
 * Check if WebRTC is supported
 */
export function isWebRTCSupported(): boolean {
  const RTCPeerConnection =
    window.RTCPeerConnection ||
    (window as Window & { webkitRTCPeerConnection?: typeof RTCPeerConnection }).webkitRTCPeerConnection ||
    (window as Window & { mozRTCPeerConnection?: typeof RTCPeerConnection }).mozRTCPeerConnection;

  return !!RTCPeerConnection;
}

/**
 * Get detailed WebRTC capabilities
 */
export function getWebRTCCapabilities(): {
  supported: boolean;
  mediaDevices: boolean;
  getUserMedia: boolean;
  getDisplayMedia: boolean;
} {
  const RTCPeerConnection =
    window.RTCPeerConnection ||
    (window as Window & { webkitRTCPeerConnection?: typeof RTCPeerConnection }).webkitRTCPeerConnection;

  return {
    supported: !!RTCPeerConnection,
    mediaDevices: !!navigator.mediaDevices,
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    getDisplayMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)
  };
}
