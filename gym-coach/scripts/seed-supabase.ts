import { createClient } from '@supabase/supabase-js'
import exercises from '../data/exercises.json' assert { type: 'json' }
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Map camelCase JSON fields to snake_case DB columns
const mapExercise = (ex: any, index: number) => ({
    id: ex.id ?? `exercise-${index}`,
    name: ex.name,
    force: ex.force ?? null,
    level: ex.level ?? null,
    mechanic: ex.mechanic ?? null,
    equipment: ex.equipment ?? null,
    category: ex.category ?? null,
    primary_muscles: ex.primaryMuscles ?? [],
    secondary_muscles: ex.secondaryMuscles ?? [],
    instructions: ex.instructions ?? [],
    images: (ex.images ?? []).map((img: string) =>
        img.startsWith('exercises/') ? img : `exercises/${img}`
    ),
})

const BATCH_SIZE = 100

async function seed() {
    console.log(`🌱  Seeding ${exercises.length} exercises into Supabase...`)

    const rows = exercises.map(mapExercise)
    let inserted = 0

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE)
        const { error } = await supabase
            .from('exercises')
            .upsert(batch, { onConflict: 'id' })

        if (error) {
            console.error(`❌  Error at batch ${i / BATCH_SIZE + 1}:`, error.message)
            process.exit(1)
        }

        inserted += batch.length
        console.log(`   ✔ ${inserted}/${rows.length} inserted`)
    }

    console.log('✅  Seed complete!')
}

seed()
