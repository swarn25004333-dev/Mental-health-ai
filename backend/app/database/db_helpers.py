from typing import Dict, Any, List, Optional
from app.database.supabase import get_supabase_client
from app.core.logging import get_logger

logger = get_logger("db_helpers")


def insert_record(table_name: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Generic helper to insert a record into a table."""
    client = get_supabase_client()
    if not client:
        logger.warning(f"Supabase client unavailable. Dry run insert into {table_name}.")
        return data

    try:
        response = client.table(table_name).insert(data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error inserting record into {table_name}: {str(e)}")
        raise e


def fetch_records_by_user(
    table_name: str,
    user_id: str,
    order_by: str = "created_at",
    descending: bool = True,
    limit: Optional[int] = None
) -> List[Dict[str, Any]]:
    """Generic helper to fetch user records ordered by date."""
    client = get_supabase_client()
    if not client:
        logger.warning(f"Supabase client unavailable. Returning empty list for {table_name}.")
        return []

    try:
        query = client.table(table_name).select("*").eq("user_id", user_id).order(order_by, desc=descending)
        if limit:
            query = query.limit(limit)
        response = query.execute()
        return response.data or []
    except Exception as e:
        logger.error(f"Error fetching user records from {table_name}: {str(e)}")
        raise e


def fetch_record_by_id(table_name: str, record_id: str) -> Optional[Dict[str, Any]]:
    """Generic helper to fetch a record by ID."""
    client = get_supabase_client()
    if not client:
        return None

    try:
        response = client.table(table_name).select("*").eq("id", record_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error fetching record {record_id} from {table_name}: {str(e)}")
        raise e


def update_record(table_name: str, record_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Generic helper to update a record by ID."""
    client = get_supabase_client()
    if not client:
        return data

    try:
        response = client.table(table_name).update(data).eq("id", record_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error updating record {record_id} in {table_name}: {str(e)}")
        raise e


def delete_record(table_name: str, record_id: str, user_id: str) -> bool:
    """Generic helper to delete a record owned by user_id."""
    client = get_supabase_client()
    if not client:
        return True

    try:
        client.table(table_name).delete().eq("id", record_id).eq("user_id", user_id).execute()
        return True
    except Exception as e:
        logger.error(f"Error deleting record {record_id} from {table_name}: {str(e)}")
        raise e
