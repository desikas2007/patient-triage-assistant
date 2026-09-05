"""
Gemini API client for Patient Intake Triage Assistant.
Handles all interactions with Google Gemini API.
"""
from typing import Optional
from google import genai
from google.genai import types

from backend.config import GEMINI_API_KEY, GEMINI_MODEL


class GeminiClient:
    """Client for interacting with Gemini API."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the Gemini client."""
        self.api_key = api_key or GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        self.client = genai.Client(api_key=self.api_key)
        self.model = GEMINI_MODEL
    
    async def generate_content(
        self, 
        prompt: str, 
        system_instruction: Optional[str] = None
    ) -> str:
        """
        Generate content using Gemini.
        
        Args:
            prompt: The user prompt
            system_instruction: Optional system instruction
            
        Returns:
            Generated text response
        """
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.3,  # Low temperature for consistent medical responses
            max_output_tokens=1024,
        )
        
        response = await self.client.aio.models.generate_content(
            model=self.model,
            contents=prompt,
            config=config,
        )
        
        return response.text
    
    async def extract_structured_facts(self, patient_text: str) -> dict:
        """
        Extract structured facts from patient text.
        
        This is a placeholder that will be implemented in the next phase.
        """
        # TODO: Implement structured fact extraction with proper prompts
        raise NotImplementedError("Structured fact extraction not yet implemented")
    
    async def generate_follow_up_questions(
        self, 
        facts: dict, 
        missing_info: list
    ) -> list:
        """
        Generate follow-up questions based on missing information.
        
        This is a placeholder that will be implemented in the next phase.
        """
        # TODO: Implement follow-up question generation
        raise NotImplementedError("Follow-up question generation not yet implemented")


# Singleton instance
_gemini_client: Optional[GeminiClient] = None


def get_gemini_client() -> GeminiClient:
    """Get or create the Gemini client singleton."""
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = GeminiClient()
    return _gemini_client
