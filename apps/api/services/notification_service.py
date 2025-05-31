from loguru import logger

class NotificationService:
    """
    Unified service for sending alerts across different channels (Slack, Email, Webhook).
    """
    
    async def send(self, channel: dict, message: str):
        channel_type = channel.get("type")
        
        if channel_type == "slack":
            await self._send_slack(channel.get("webhook_url"), message)
        elif channel_type == "email":
            await self._send_email(channel.get("email"), message)
        elif channel_type == "webhook":
            await self._send_webhook(channel.get("url"), message)
        else:
            logger.error(f"Unsupported notification channel: {channel_type}")

    async def _send_slack(self, url: str, message: str):
        # In production use httpx to POST to Slack
        logger.info(f"SLACK NOTIFICATION -> {url}: {message}")

    async def _send_email(self, email: str, message: str):
        logger.info(f"EMAIL NOTIFICATION -> {email}: {message}")

    async def _send_webhook(self, url: str, message: str):
        logger.info(f"WEBHOOK NOTIFICATION -> {url}: {message}")
