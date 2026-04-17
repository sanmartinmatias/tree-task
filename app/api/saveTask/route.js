import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const data = await request.json();
    const filePath = join(process.cwd(), 'data', 'tasks.json');
    
    // Write the new nodes object back to your tasks.json
    await writeFile(filePath, JSON.stringify(data, null, 2));
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}